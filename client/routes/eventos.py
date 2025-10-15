from flask import Blueprint, request, jsonify
from service.eventoGrpcClient import EventoClient
from service.grpcClient import UsuarioClient
from service.inventarioGrpcClient import InventarioClient
from service.jwt_utils import require_role
import grpc
import time
import os
import requests

# Crear blueprint para eventos
eventos_bp = Blueprint("eventos", __name__, url_prefix="/eventos")

# Cliente gRPC para eventos
evento_client = EventoClient()
usuario_client = UsuarioClient()
inventario_client = InventarioClient()

# Base URL del servicio de eventos (REST)
EVENTOS_BASE_URL = os.getenv("EVENTOS_BASE_URL", "http://localhost:8082")


def extract_token():
    """Función auxiliar para extraer token JWT"""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header[7:]
        return token
    return None


def _map_grpc_status(e: grpc.RpcError) -> int:
    code = e.code().name if hasattr(e, "code") else None
    if code == "UNAUTHENTICATED":
        return 401
    if code == "PERMISSION_DENIED":
        return 403
    if code == "NOT_FOUND":
        return 404
    if code == "ALREADY_EXISTS":
        return 409
    if code == "INVALID_ARGUMENT":
        return 400
    return 500


def _resolver_participantes_map(ids: set[int]) -> dict[int, dict]:
    """Obtiene un mapa id -> {id,nombre,apellido} para los IDs solicitados."""
    try:
        usuarios = usuario_client.listarUsuarios()  # traer todos (activos e inactivos)
        mapa: dict[int, dict] = {}
        for u in usuarios.usuarios:
            if u.id in ids:
                mapa[u.id] = {"id": u.id, "nombre": u.nombre, "apellido": u.apellido}
        return mapa
    except grpc.RpcError:
        return {}


@eventos_bp.route("/externos", methods=["GET"])
def listar_eventos_externos():
    """Listar eventos externos (activos o solo futuros) desde el servicio de eventos (REST)."""
    try:
        # Token opcional (por ahora el backend REST no lo requiere)
        token = extract_token()
        solo_futuros = request.args.get("soloFuturos", "false").lower() == "true"
        url = f"{EVENTOS_BASE_URL}/externos"
        params = {"soloFuturos": str(solo_futuros).lower()}
        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        resp = requests.get(url, params=params, headers=headers, timeout=5)
        if resp.status_code >= 400:
            try:
                return jsonify(resp.json()), resp.status_code
            except Exception:
                return jsonify({"error": f"Error {resp.status_code} del servicio de eventos"}), resp.status_code
        data = resp.json() or {}
        # Normalizar salida: asegurar clave "eventos" sea lista
        eventos = data.get("eventos", [])
        # Alinear nombres de campos con frontend si hace falta
        # Devolvemos tal cual por ahora: [{idOrganizacion, idEvento, nombreEvento, descripcion, fechaHora, activo}]
        return jsonify({"eventos": eventos})
    except requests.RequestException as e:
        return jsonify({"error": f"Falló la comunicación con eventos-service: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route("", methods=["GET"])
def listar_eventos():
    """Listar eventos, opcionalmente solo los futuros, incluyendo nombres de participantes"""
    try:
        token = extract_token()
        if not token:
            return jsonify({"error": "Token de autorización requerido"}), 401
        solo_futuros = request.args.get("soloFuturos", "false").lower() == "true"
        eventos = evento_client.listar_eventos(solo_futuros, token)

        # Resolver nombres de participantes
        all_ids: set[int] = set()
        for ev in eventos.eventos:
            all_ids.update(list(ev.participantesIds))
        participantes_map = _resolver_participantes_map(all_ids) if all_ids else {}

        eventos_list = []
        for evento in eventos.eventos:
            participantes = [
                participantes_map.get(pid, {"id": pid, "nombre": "Usuario", "apellido": str(pid)})
                for pid in list(evento.participantesIds)
            ]
            eventos_list.append(
                {
                    "id": evento.id,
                    "nombreEvento": evento.nombreEvento,
                    "descripcion": evento.descripcion,
                    "fechaHoraEvento": evento.fechaHoraEvento,
                    "participantesIds": list(evento.participantesIds),
                    "participantes": participantes,
                    "donacionesRepartidas": [
                        {
                            "categoria": donacion.categoria,
                            "descripcion": donacion.descripcion,
                            "cantidadRepartida": donacion.cantidadRepartida,
                            "fechaRepartida": donacion.fechaRepartida,
                            "usuarioRepartida": donacion.usuarioRepartida,
                            "nombreUsuarioRepartida": donacion.nombreUsuarioRepartida,
                        }
                        for donacion in evento.donacionesRepartidas
                    ],
                    "fechaCreacion": evento.fechaCreacion,
                    "usuarioCreacion": evento.usuarioCreacion,
                    "activo": evento.activo,
                }
            )

        return jsonify({"eventos": eventos_list})
    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route("", methods=["POST"])
def crear_evento():
    """Crear nuevo evento"""
    try:
        token = extract_token()
        if not token:
            return jsonify({"error": "Token de autorización requerido"}), 401

        data = request.get_json()

        evento = evento_client.crear_evento(
            data["nombreEvento"], data["descripcion"], data["fechaHoraEvento"], token
        )

        return (
            jsonify(
                {
                    "id": evento.id,
                    "nombreEvento": evento.nombreEvento,
                    "descripcion": evento.descripcion,
                    "fechaHoraEvento": evento.fechaHoraEvento,
                    "participantesIds": list(evento.participantesIds),
                    "participantes": [],
                    "fechaCreacion": evento.fechaCreacion,
                    "usuarioCreacion": evento.usuarioCreacion,
                    "activo": evento.activo,
                }
            ),
            201,
        )

    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route("/<string:evento_id>", methods=["GET"])
def buscar_evento(evento_id):
    """Buscar evento por ID e incluir nombres participantes"""
    try:
        token = extract_token()
        if not token:
            return jsonify({"error": "Token de autorización requerido"}), 401

        evento = evento_client.buscar_evento_por_id(evento_id, token)

        participantes_map = _resolver_participantes_map(set(evento.participantesIds))
        participantes = [
            participantes_map.get(pid, {"id": pid, "nombre": "Usuario", "apellido": str(pid)})
            for pid in list(evento.participantesIds)
        ]

        return jsonify(
            {
                "id": evento.id,
                "nombreEvento": evento.nombreEvento,
                "descripcion": evento.descripcion,
                "fechaHoraEvento": evento.fechaHoraEvento,
                "participantesIds": list(evento.participantesIds),
                "participantes": participantes,
                "donacionesRepartidas": [
                    {
                        "categoria": donacion.categoria,
                        "descripcion": donacion.descripcion,
                        "cantidadRepartida": donacion.cantidadRepartida,
                        "fechaRepartida": donacion.fechaRepartida,
                        "usuarioRepartida": donacion.usuarioRepartida,
                        "nombreUsuarioRepartida": donacion.nombreUsuarioRepartida,
                    }
                    for donacion in evento.donacionesRepartidas
                ],
                "fechaCreacion": evento.fechaCreacion,
                "usuarioCreacion": evento.usuarioCreacion,
                "activo": evento.activo,
            }
        )

    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route("/<string:evento_id>", methods=["PUT"])
def modificar_evento(evento_id):
    """Modificar evento existente"""
    try:
        token = extract_token()
        if not token:
            return jsonify({"error": "Token de autorización requerido"}), 401

        # Validar que no sea evento pasado
        ev = evento_client.buscar_evento_por_id(evento_id, token)
        ahora_ms = int(time.time() * 1000)
        if ev.fechaHoraEvento <= ahora_ms:
            return jsonify({
                "error": "No se puede modificar un evento pasado. Solo es posible registrar donaciones desde 'Ver Donaciones'."
            }), 400

        data = request.get_json()
        data["id"] = evento_id

        evento = evento_client.modificar_evento(data, token)

        return jsonify(
            {
                "id": evento.id,
                "nombreEvento": evento.nombreEvento,
                "descripcion": evento.descripcion,
                "fechaHoraEvento": evento.fechaHoraEvento,
                "participantesIds": list(evento.participantesIds),
                "donacionesRepartidas": [
                    {
                        "categoria": donacion.categoria,
                        "descripcion": donacion.descripcion,
                        "cantidadRepartida": donacion.cantidadRepartida,
                        "fechaRepartida": donacion.fechaRepartida,
                        "usuarioRepartida": donacion.usuarioRepartida,
                        "nombreUsuarioRepartida": donacion.nombreUsuarioRepartida,
                    }
                    for donacion in evento.donacionesRepartidas
                ],
                "fechaCreacion": evento.fechaCreacion,
                "usuarioCreacion": evento.usuarioCreacion,
                "activo": evento.activo,
            }
        )

    except grpc.RpcError as e:
        # Propagar detalle claro si lo hay
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route("/<string:evento_id>", methods=["DELETE"])
def eliminar_evento(evento_id):
    """Eliminar evento"""
    try:
        token = extract_token()
        if not token:
            return jsonify({"error": "Token de autorización requerido"}), 401

        # Validar que sea evento a futuro
        ev = evento_client.buscar_evento_por_id(evento_id, token)
        ahora_ms = int(time.time() * 1000)
        if ev.fechaHoraEvento <= ahora_ms:
            return jsonify({"error": "Solo se pueden eliminar eventos a futuro"}), 400

        resultado = evento_client.eliminar_evento(evento_id, token)

        return jsonify({"message": resultado.mensaje, "exito": resultado.exito})

    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route(
    "/<string:evento_id>/participantes", methods=["POST"]
)
def asignar_participante(evento_id):
    """Asignar participante a un evento"""
    try:
        token = extract_token()
        if not token:
            return jsonify({"error": "Token de autorización requerido"}), 401

        data = request.get_json()

        resultado = evento_client.asignar_participante(
            evento_id, data["usuarioId"], token
        )

        return jsonify({"message": resultado.mensaje, "exito": resultado.exito})

    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route(
    "/<string:evento_id>/participantes/<int:usuario_id>", methods=["DELETE"]
)
def quitar_participante(evento_id, usuario_id):
    """Quitar participante de un evento"""
    try:
        token = extract_token()
        if not token:
            return jsonify({"error": "Token de autorización requerido"}), 401

        resultado = evento_client.quitar_participante(evento_id, usuario_id, token)

        return jsonify({"message": resultado.mensaje, "exito": resultado.exito})

    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route("/<string:evento_id>/donaciones", methods=["POST"])
def registrar_donacion(evento_id):
    """Registrar donación repartida en un evento"""
    try:
        token = extract_token()
        if not token:
            return jsonify({"error": "Token de autorización requerido"}), 401

        data = request.get_json()
        categoria = str(data.get("categoria", "")).upper().strip()
        descripcion = str(data.get("descripcion", "")).strip()
        try:
            cantidad = int(data.get("cantidad", 0))
        except Exception:
            cantidad = 0

        # Validaciones básicas
        categorias_validas = {"ROPA", "ALIMENTOS", "JUGUETES", "UTILES_ESCOLARES"}
        if categoria not in categorias_validas:
            return jsonify({"error": "Categoría inválida"}), 400
        if not descripcion:
            return jsonify({"error": "Descripción requerida"}), 400
        if cantidad <= 0:
            return jsonify({"error": "La cantidad debe ser mayor a 0"}), 400

        # Validar que el evento sea pasado
        ev = evento_client.buscar_evento_por_id(evento_id, token)
        ahora_ms = int(time.time() * 1000)
        if ev.fechaHoraEvento > ahora_ms:
            return jsonify({"error": "Solo se pueden registrar donaciones en eventos pasados"}), 400

        # Validar stock en inventario (no eliminado)
        # Mapear categoría a enum numérico del inventario
        cat_map = {
            "ROPA": 0,
            "ALIMENTOS": 1,
            "JUGUETES": 2,
            "UTILES_ESCOLARES": 3,
        }
        cat_val = cat_map[categoria]
        inv_resp = inventario_client.listar_items(False)  # excluir eliminados
        match = None
        for it in inv_resp.items:
            try:
                desc_it = (it.descripcion or "").strip().lower()
            except Exception:
                desc_it = ""
            if it.categoria == cat_val and desc_it == descripcion.lower():
                match = it
                break
        if match is None:
            return jsonify({"error": "No existe un ítem de inventario activo con esa categoría y descripción"}), 400
        if match.cantidad < cantidad:
            return jsonify({"error": "Stock insuficiente en inventario"}), 400

        # Registrar donación en el servicio de eventos (este descontará el inventario)
        resultado = evento_client.registrar_donacion_repartida(
            evento_id, categoria, descripcion, cantidad, token
        )

        return jsonify({"message": resultado.mensaje, "exito": resultado.exito})

    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route("/inventario-activo", methods=["GET"])
def inventario_activo():
    # Solo PRESIDENTE o COORDINADOR
    user, err = require_role([0, 2])
    if err:
        return err
    try:
        resp = inventario_client.listar_items(False)  # solo activos (no eliminados)
        # Mapeo enum numérico a nombre
        cat_names = {
            0: "ROPA",
            1: "ALIMENTOS",
            2: "JUGUETES",
            3: "UTILES_ESCOLARES",
        }
        items = [
            {
                "id": it.id,
                "categoria": cat_names.get(it.categoria, str(it.categoria)),
                "descripcion": it.descripcion,
                "cantidad": it.cantidad,
            }
            for it in resp.items
            if not it.eliminado
        ]
        return jsonify({"items": items})
    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500

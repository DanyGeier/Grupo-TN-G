from flask import Blueprint, request, jsonify
from service.eventoGrpcClient import EventoClient

# Crear blueprint para eventos
eventos_bp = Blueprint("eventos", __name__, url_prefix="/eventos")

# Cliente gRPC para eventos
evento_client = EventoClient()


def extract_token():
    """Función auxiliar para extraer token JWT"""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:]  # Remover 'Bearer '
    return None


@eventos_bp.route("", methods=["GET"])
def listar_eventos():
    """Listar eventos, opcionalmente solo los futuros"""
    try:
        token = extract_token()
        solo_futuros = request.args.get("soloFuturos", "false").lower() == "true"

        eventos = evento_client.listar_eventos(solo_futuros, token)
        eventos_list = []

        for evento in eventos.eventos:
            eventos_list.append(
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

        return jsonify({"eventos": eventos_list})
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
                    "fechaCreacion": evento.fechaCreacion,
                    "usuarioCreacion": evento.usuarioCreacion,
                    "activo": evento.activo,
                }
            ),
            201,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route("/<string:evento_id>", methods=["GET"])
def buscar_evento(evento_id):
    """Buscar evento por ID"""
    try:
        token = extract_token()
        if not token:
            return jsonify({"error": "Token de autorización requerido"}), 401

        evento = evento_client.buscar_evento_por_id(evento_id, token)

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

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route("/<string:evento_id>", methods=["PUT"])
def modificar_evento(evento_id):
    """Modificar evento existente"""
    try:
        token = extract_token()
        if not token:
            return jsonify({"error": "Token de autorización requerido"}), 401

        data = request.get_json()
        data["id"] = evento_id  # Asegurar que el ID sea el correcto

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

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route("/<string:evento_id>", methods=["DELETE"])
def eliminar_evento(evento_id):
    """Eliminar evento"""
    try:
        token = extract_token()
        if not token:
            return jsonify({"error": "Token de autorización requerido"}), 401

        resultado = evento_client.eliminar_evento(evento_id, token)

        return jsonify({"message": resultado.mensaje, "exito": resultado.exito})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@eventos_bp.route("/<string:evento_id>/participantes", methods=["POST"])
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

        resultado = evento_client.registrar_donacion_repartida(
            evento_id, data["categoria"], data["descripcion"], data["cantidad"], token
        )

        return jsonify({"message": resultado.mensaje, "exito": resultado.exito})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

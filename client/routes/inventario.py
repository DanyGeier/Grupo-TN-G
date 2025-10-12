from flask import Blueprint, jsonify, request
from service.jwt_utils import require_role, get_current_user
from service.inventarioGrpcClient import InventarioClient
import grpc

inventario_bp = Blueprint("inventario", __name__, url_prefix="/inventario")

client = InventarioClient()


@inventario_bp.route("/health", methods=["GET"])
def health():
    try:
        # Intento de listar minimal para verificar disponibilidad
        client.listar_items(False)
        return "OK", 200
    except Exception as e:
        return jsonify({"status": "down", "error": str(e)}), 503


@inventario_bp.route("", methods=["GET"])
def listar_items():
    user, err = require_role([0, 1])  # PRESIDENTE, VOCAL
    if err:
        return err
    try:
        incluir_eliminados = (
            request.args.get("incluirEliminados", "true").lower() == "true"
        )
        resp = client.listar_items(incluir_eliminados)
        items = [
            {
                "id": it.id,
                "categoria": it.categoria,
                "descripcion": it.descripcion,
                "cantidad": it.cantidad,
                "eliminado": it.eliminado,
                "fechaAlta": it.fechaAlta,
                "usuarioAlta": it.usuarioAlta,
                "fechaModificacion": it.fechaModificacion,
                "usuarioModificacion": it.usuarioModificacion,
            }
            for it in resp.items
        ]
        return jsonify({"items": items})
    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), 502


@inventario_bp.route("", methods=["POST"])
def crear_item():
    user, err = require_role([0, 1])
    if err:
        return err
    data = request.get_json(force=True)
    try:
        resp = client.crear_item(
            data["categoria"],
            data.get("descripcion", ""),
            int(data["cantidad"]),
            user.get("nombreUsuario", ""),
        )
        return (
            jsonify(
                {
                    "id": resp.id,
                    "categoria": resp.categoria,
                    "descripcion": resp.descripcion,
                    "cantidad": resp.cantidad,
                    "eliminado": resp.eliminado,
                    "fechaAlta": resp.fechaAlta,
                    "usuarioAlta": resp.usuarioAlta,
                    "fechaModificacion": resp.fechaModificacion,
                    "usuarioModificacion": resp.usuarioModificacion,
                }
            ),
            201,
        )
    except grpc.RpcError as e:
        code = e.code().name if hasattr(e, "code") else None
        status = 400 if code in ("INVALID_ARGUMENT",) else 500
        return jsonify({"error": e.details() or "Error gRPC"}), status


@inventario_bp.route("/<int:item_id>", methods=["PUT"])
def actualizar_item(item_id: int):
    user, err = require_role([0, 1])
    if err:
        return err
    data = request.get_json(force=True)
    try:
        resp = client.actualizar_item(
            item_id,
            data.get("descripcion", ""),
            int(data["cantidad"]),
            user.get("nombreUsuario", ""),
        )
        return jsonify(
            {
                "id": resp.id,
                "categoria": resp.categoria,
                "descripcion": resp.descripcion,
                "cantidad": resp.cantidad,
                "eliminado": resp.eliminado,
                "fechaAlta": resp.fechaAlta,
                "usuarioAlta": resp.usuarioAlta,
                "fechaModificacion": resp.fechaModificacion,
                "usuarioModificacion": resp.usuarioModificacion,
            }
        )
    except grpc.RpcError as e:
        code = e.code().name if hasattr(e, "code") else None
        if code == "NOT_FOUND":
            return jsonify({"error": "Item no encontrado"}), 404
        status = 400 if code in ("INVALID_ARGUMENT",) else 500
        return jsonify({"error": e.details() or "Error gRPC"}), status


@inventario_bp.route("/<int:item_id>", methods=["DELETE"])
def baja_item(item_id: int):
    user, err = require_role([0, 1])
    if err:
        return err
    try:
        resp = client.baja_logica(item_id, user.get("nombreUsuario", ""))
        return jsonify({"mensaje": resp.mensaje, "exito": resp.exito})
    except grpc.RpcError as e:
        code = e.code().name if hasattr(e, "code") else None
        if code == "NOT_FOUND":
            return jsonify({"error": "Item no encontrado"}), 404
        return jsonify({"error": e.details() or "Error gRPC"}), 500


# ========== KAFKA - Solicitudes de donación ==========


@inventario_bp.route("/solicitar-donaciones", methods=["POST"])
def solicitar_donaciones():
    """POST /inventario/solicitar-donaciones - Enviar solicitud a la red de ONGs"""
    data = request.get_json(force=True)
    try:
        donaciones = data.get("donaciones", [])
        resp = client.solicitar_donaciones(donaciones)

        return (
            jsonify(
                {
                    "idSolicitud": resp.idSolicitud,
                    "mensaje": resp.mensaje,
                    "exito": resp.exito,
                }
            ),
            201,
        )
    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), 500


@inventario_bp.route("/solicitudes-externas", methods=["GET"])
def listar_solicitudes_externas():
    """GET /inventario/solicitudes-externas - Listar solicitudes de otras organizaciones"""
    try:
        solo_activas = request.args.get("soloActivas", "true").lower() == "true"
        resp = client.listar_solicitudes_externas(solo_activas)

        solicitudes = [
            {
                "idSolicitud": s.idSolicitud,
                "idOrganizacionSolicitante": s.idOrganizacionSolicitante,
                "donaciones": [
                    {
                        "categoria": d.categoria,
                        "descripcion": d.descripcion,
                        "cantidad": d.cantidad,
                    }
                    for d in s.donaciones
                ],
                "activa": s.activa,
                "fechaRecepcion": s.fechaRecepcion,
            }
            for s in resp.solicitudes
        ]

        return jsonify({"solicitudes": solicitudes})
    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), 500


@inventario_bp.route("/transferir-donacion", methods=["POST"])
def transferir_donacion():
    """POST /inventario/transferir-donacion - Transferir donaciones a organización solicitante"""
    data = request.get_json(force=True)
    try:
        id_solicitud = data.get("idSolicitud")
        donaciones = data.get("donaciones", [])

        if not id_solicitud:
            return jsonify({"error": "idSolicitud es requerido"}), 400

        resp = client.transferir_donacion(id_solicitud, donaciones)

        return jsonify({"mensaje": resp.mensaje, "exito": resp.exito})
    except grpc.RpcError as e:
        code = e.code().name if hasattr(e, "code") else None
        if code == "NOT_FOUND":
            return jsonify({"error": "Solicitud no encontrada"}), 404
        if code == "FAILED_PRECONDITION":
            return jsonify({"error": e.details()}), 400
        return jsonify({"error": e.details() or "Error gRPC"}), 500

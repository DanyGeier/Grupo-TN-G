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
        incluir_eliminados = request.args.get("incluirEliminados", "true").lower() == "true"
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
            data["categoria"], data.get("descripcion", ""), int(data["cantidad"]), user.get("nombreUsuario", "")
        )
        return jsonify({
            "id": resp.id,
            "categoria": resp.categoria,
            "descripcion": resp.descripcion,
            "cantidad": resp.cantidad,
            "eliminado": resp.eliminado,
            "fechaAlta": resp.fechaAlta,
            "usuarioAlta": resp.usuarioAlta,
            "fechaModificacion": resp.fechaModificacion,
            "usuarioModificacion": resp.usuarioModificacion,
        }), 201
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
        resp = client.actualizar_item(item_id, data.get("descripcion", ""), int(data["cantidad"]), user.get("nombreUsuario", ""))
        return jsonify({
            "id": resp.id,
            "categoria": resp.categoria,
            "descripcion": resp.descripcion,
            "cantidad": resp.cantidad,
            "eliminado": resp.eliminado,
            "fechaAlta": resp.fechaAlta,
            "usuarioAlta": resp.usuarioAlta,
            "fechaModificacion": resp.fechaModificacion,
            "usuarioModificacion": resp.usuarioModificacion,
        })
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

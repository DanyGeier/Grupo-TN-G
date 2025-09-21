from flask import Blueprint, request, jsonify
from service.inventarioGrpcClient import InventarioClient

inventario_bp = Blueprint("inventario", __name__, url_prefix="/inventario")

inventario_client = InventarioClient()


@inventario_bp.route("", methods=["GET"])
def listar_items():
    try:
        incluir = request.args.get("incluirEliminados", "false").lower() == "true"
        resp = inventario_client.listar_items(incluir)
        items = []
        for it in resp.items:
            items.append(
                {
                    "id": it.id,
                    "categoria": it.categoria,
                    "nombre": it.nombre,
                    "descripcion": it.descripcion,
                    "cantidad": it.cantidad,
                    "eliminado": it.eliminado,
                    "fechaAlta": it.fechaAlta,
                    "usuarioAlta": it.usuarioAlta,
                    "fechaModificacion": it.fechaModificacion,
                    "usuarioModificacion": it.usuarioModificacion,
                }
            )
        return jsonify({"items": items})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@inventario_bp.route("", methods=["POST"])
def crear_item():
    try:
        data = request.get_json() or {}
        item = inventario_client.crear_item(
            data["categoria"],
            data.get("nombre", ""),
            data.get("descripcion", ""),
            int(data.get("cantidad", 0)),
            data.get("usuario", ""),
        )
        return (
            jsonify(
                {
                    "id": item.id,
                    "categoria": item.categoria,
                    "nombre": item.nombre,
                    "descripcion": item.descripcion,
                    "cantidad": item.cantidad,
                    "eliminado": item.eliminado,
                    "fechaAlta": item.fechaAlta,
                    "usuarioAlta": item.usuarioAlta,
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@inventario_bp.route("/<string:item_id>", methods=["PUT"])
def actualizar_item(item_id: str):
    try:
        data = request.get_json() or {}
        item = inventario_client.actualizar_item(
            item_id,
            data.get("descripcion", ""),
            int(data.get("cantidad", 0)),
            data.get("usuario", ""),
        )
        return jsonify(
            {
                "id": item.id,
                "categoria": item.categoria,
                "nombre": item.nombre,
                "descripcion": item.descripcion,
                "cantidad": item.cantidad,
                "eliminado": item.eliminado,
                "fechaModificacion": item.fechaModificacion,
                "usuarioModificacion": item.usuarioModificacion,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@inventario_bp.route("/<string:item_id>", methods=["DELETE"])
def eliminar_item(item_id: str):
    try:
        data = request.get_json(silent=True) or {}
        resp = inventario_client.eliminar_item(item_id, data.get("usuario", ""))
        return jsonify({"exito": resp.exito, "mensaje": resp.mensaje})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


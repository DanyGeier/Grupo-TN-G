import os
import grpc
from proto import inventario_pb2, inventario_pb2_grpc


class InventarioClient(object):
    def __init__(self):
        self.host = os.getenv("INVENTARIO_GRPC_HOST", "inventario")
        self.server_port = os.getenv("INVENTARIO_GRPC_PORT", "9097")
        self.channel = grpc.insecure_channel(f"{self.host}:{self.server_port}")
        self.stub = inventario_pb2_grpc.InventarioServiceStub(self.channel)

    def crear_item(self, categoria_str, nombre, descripcion, cantidad, usuario):
        categoria_map = {
            "ROPA": inventario_pb2.CategoriaInventario.ROPA,
            "ALIMENTOS": inventario_pb2.CategoriaInventario.ALIMENTOS,
            "JUGUETES": inventario_pb2.CategoriaInventario.JUGUETES,
            "UTILES_ESCOLARES": inventario_pb2.CategoriaInventario.UTILES_ESCOLARES,
        }
        req = inventario_pb2.CrearItemRequest(
            categoria=categoria_map.get(categoria_str, inventario_pb2.CategoriaInventario.ROPA),
            nombre=nombre,
            descripcion=descripcion,
            cantidad=cantidad,
            usuario=usuario or "api-gateway",
        )
        return self.stub.CrearItem(req)

    def actualizar_item(self, item_id, descripcion, cantidad, usuario):
        req = inventario_pb2.ActualizarItemRequest(
            id=item_id,
            descripcion=descripcion,
            cantidad=cantidad,
            usuario=usuario or "api-gateway",
        )
        return self.stub.ActualizarItem(req)

    def eliminar_item(self, item_id, usuario):
        req = inventario_pb2.EliminarItemRequest(id=item_id, usuario=usuario or "api-gateway")
        return self.stub.EliminarItem(req)

    def listar_items(self, incluir_eliminados=False):
        req = inventario_pb2.ListarItemsRequest(incluirEliminados=incluir_eliminados)
        return self.stub.ListarItems(req)


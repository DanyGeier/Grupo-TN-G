import os
import grpc
from proto import inventario_pb2, inventario_pb2_grpc


class InventarioClient(object):
    def __init__(self):
        self.host = os.getenv("INVENTARIO_GRPC_HOST", "inventario")
        self.port = os.getenv("INVENTARIO_GRPC_PORT", "9097")
        self.channel = grpc.insecure_channel(f"{self.host}:{self.port}")
        self.stub = inventario_pb2_grpc.InventarioServiceStub(self.channel)

    def listar_items(self, incluir_eliminados=False):
        req = inventario_pb2.ListarItemsRequest(incluirEliminados=incluir_eliminados)
        return self.stub.listarItems(req)

    def crear_item(self, categoria: str, descripcion: str, cantidad: int, usuario: str):
        cat_map = {
            "ROPA": inventario_pb2.CategoriaInventario.ROPA,
            "ALIMENTOS": inventario_pb2.CategoriaInventario.ALIMENTOS,
            "JUGUETES": inventario_pb2.CategoriaInventario.JUGUETES,
            "UTILES_ESCOLARES": inventario_pb2.CategoriaInventario.UTILES_ESCOLARES,
        }
        req = inventario_pb2.CrearItemRequest(
            categoria=cat_map.get(categoria, inventario_pb2.CategoriaInventario.ROPA),
            descripcion=descripcion,
            cantidad=cantidad,
            usuarioEjecutor=usuario,
        )
        return self.stub.crearItem(req)

    def actualizar_item(self, id: int, descripcion: str, cantidad: int, usuario: str):
        req = inventario_pb2.ActualizarItemRequest(
            id=id,
            descripcion=descripcion,
            cantidad=cantidad,
            usuarioEjecutor=usuario,
        )
        return self.stub.actualizarItem(req)

    def baja_logica(self, id: int, usuario: str):
        req = inventario_pb2.BajaLogicaItemRequest(id=id, usuarioEjecutor=usuario)
        return self.stub.bajaLogicaItem(req)

    def buscar_por_id(self, id: int):
        req = inventario_pb2.BuscarItemPorIdRequest(id=id)
        return self.stub.buscarItemPorId(req)

    # ========== KAFKA - Solicitudes de donación ==========

    def solicitar_donaciones(self, donaciones: list):
        """Enviar solicitud de donaciones a la red de ONGs"""
        donaciones_proto = [
            inventario_pb2.DonacionItem(
                categoria=d.get("categoria", ""),
                descripcion=d.get("descripcion", ""),
                cantidad=d.get("cantidad", 0),
            )
            for d in donaciones
        ]

        req = inventario_pb2.SolicitarDonacionesRequest(donaciones=donaciones_proto)
        return self.stub.solicitarDonaciones(req)

    def listar_solicitudes_externas(self, solo_activas=True):
        """Listar solicitudes externas de otras organizaciones"""
        req = inventario_pb2.ListarSolicitudesExternasRequest(soloActivas=solo_activas)
        return self.stub.listarSolicitudesExternas(req)

    def transferir_donacion(self, id_solicitud: str, donaciones: list):
        """Transferir donaciones a una organización solicitante"""
        donaciones_proto = [
            inventario_pb2.DonacionItem(
                categoria=d.get("categoria", ""),
                descripcion=d.get("descripcion", ""),
                cantidad=d.get("cantidad", 0),
            )
            for d in donaciones
        ]

        req = inventario_pb2.TransferirDonacionRequest(
            idSolicitud=id_solicitud, donaciones=donaciones_proto
        )
        return self.stub.transferirDonacion(req)

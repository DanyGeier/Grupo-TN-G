import os
import time
from concurrent import futures

import grpc
from pymongo import MongoClient
from bson import ObjectId

import proto.inventario_pb2 as inventario_pb2
import proto.inventario_pb2_grpc as inventario_pb2_grpc


MONGO_HOST = os.getenv("MONGO_HOST", "mongodb")
MONGO_PORT = int(os.getenv("MONGO_PORT", "27017"))
MONGO_DB = os.getenv("MONGO_DB", "eventos_db")
MONGO_USER = os.getenv("MONGO_USER", "admin")
MONGO_PASS = os.getenv("MONGO_PASS", "admin123")


class InventarioService(inventario_pb2_grpc.InventarioServiceServicer):
    def __init__(self, db):
        self.db = db
        self.col = db["inventario"]
        self.col.create_index("eliminado")

    def _doc_to_item(self, doc):
        return inventario_pb2.InventarioItem(
            id=str(doc.get("_id")),
            categoria=doc.get("categoria", 0),
            nombre=doc.get("nombre", ""),
            descripcion=doc.get("descripcion", ""),
            cantidad=int(doc.get("cantidad", 0)),
            eliminado=bool(doc.get("eliminado", False)),
            fechaAlta=int(doc.get("fechaAlta", 0)),
            usuarioAlta=str(doc.get("usuarioAlta", "")),
            fechaModificacion=int(doc.get("fechaModificacion", 0)),
            usuarioModificacion=str(doc.get("usuarioModificacion", "")),
        )

    def CrearItem(self, request, context):
        if request.cantidad < 0:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "La cantidad no puede ser negativa")
        now = int(time.time() * 1000)
        doc = {
            "categoria": int(request.categoria),
            "nombre": request.nombre,
            "descripcion": request.descripcion,
            "cantidad": int(request.cantidad),
            "eliminado": False,
            "fechaAlta": now,
            "usuarioAlta": request.usuario,
            "fechaModificacion": 0,
            "usuarioModificacion": "",
        }
        inserted = self.col.insert_one(doc)
        doc["_id"] = inserted.inserted_id
        return self._doc_to_item(doc)

    def ActualizarItem(self, request, context):
        if request.cantidad < 0:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "La cantidad no puede ser negativa")
        oid = None
        try:
            oid = ObjectId(request.id)
        except Exception:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "ID inválido")
        now = int(time.time() * 1000)
        update = {
            "$set": {
                "descripcion": request.descripcion,
                "cantidad": int(request.cantidad),
                "fechaModificacion": now,
                "usuarioModificacion": request.usuario,
            }
        }
        res = self.col.find_one_and_update({"_id": oid}, update, return_document=True)
        if not res:
            context.abort(grpc.StatusCode.NOT_FOUND, "Item no encontrado")
        return self._doc_to_item(res)

    def EliminarItem(self, request, context):
        oid = None
        try:
            oid = ObjectId(request.id)
        except Exception:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "ID inválido")
        now = int(time.time() * 1000)
        update = {
            "$set": {
                "eliminado": True,
                "fechaModificacion": now,
                "usuarioModificacion": request.usuario,
            }
        }
        res = self.col.update_one({"_id": oid}, update)
        if res.matched_count == 0:
            context.abort(grpc.StatusCode.NOT_FOUND, "Item no encontrado")
        return inventario_pb2.OperacionResponse(exito=True, mensaje="Item eliminado lógicamente")

    def ListarItems(self, request, context):
        filtro = {} if request.incluirEliminados else {"eliminado": False}
        items = []
        for doc in self.col.find(filtro).sort("fechaAlta", -1):
            items.append(self._doc_to_item(doc))
        return inventario_pb2.ListarItemsResponse(items=items)


def serve():
    if MONGO_USER and MONGO_PASS:
        uri = f"mongodb://{MONGO_USER}:{MONGO_PASS}@{MONGO_HOST}:{MONGO_PORT}/"
    else:
        uri = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/"
    client = MongoClient(uri)
    db = client[MONGO_DB]

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    inventario_pb2_grpc.add_InventarioServiceServicer_to_server(
        InventarioService(db), server
    )
    port = int(os.getenv("PORT", "9097"))
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"Inventario gRPC server iniciado en 0.0.0.0:{port}, MongoDB {MONGO_HOST}:{MONGO_PORT}/{MONGO_DB}")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()


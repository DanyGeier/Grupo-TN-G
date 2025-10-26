import os
import grpc
import logging
from proto import evento_pb2, evento_pb2_grpc
from google.protobuf.json_format import MessageToJson

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _auth_metadata(token: str | None):
    if not token:
        return None
    t = token.strip()
    if not t.lower().startswith("bearer "):
        t = f"Bearer {t}"
    return [("authorization", t)]


class EventoClient(object):
    """
    Cliente gRPC para el servicio de eventos
    """

    def __init__(self):
        self.host = os.getenv("EVENTOS_GRPC_HOST", "localhost")
        self.server_port = os.getenv("EVENTOS_GRPC_PORT", "9096")

        logger.info(
            f"[gRPC CLIENT] Inicializando EventoClient - Host: {self.host}, Puerto: {self.server_port}"
        )

        # Crear un canal
        self.channel = grpc.insecure_channel(f"{self.host}:{self.server_port}")
        logger.info(f"[gRPC CHANNEL] Canal creado para {self.host}:{self.server_port}")

        # Crear un stub
        self.stub = evento_pb2_grpc.EventoServiceStub(self.channel)
        logger.info("[gRPC CLIENT] EventoServiceStub creado correctamente")

    def crear_evento(self, nombre_evento, descripcion, fecha_hora_evento, token):
        logger.info(f"[gRPC CLIENT] Iniciando creación de evento: {nombre_evento}")
        request = evento_pb2.CrearEventoRequest(
            nombreEvento=nombre_evento,
            descripcion=descripcion,
            fechaHoraEvento=fecha_hora_evento,
        )
        try:
            md = _auth_metadata(token)
            if md:
                response, _ = self.stub.crearEvento.with_call(request, metadata=md)
            else:
                response, _ = self.stub.crearEvento.with_call(request)
            logger.info(
                f"[gRPC RESPONSE] Evento creado exitosamente - ID: {response.id}, Nombre: {response.nombreEvento}"
            )
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al crear evento {nombre_evento}: {e.code()} - {e.details()}"
            )
            raise

    def listar_eventos(self, solo_futuros=False, token=None):
        logger.info(
            f"[gRPC CLIENT] Iniciando listado de eventos - Solo futuros: {solo_futuros}"
        )
        request = evento_pb2.ListarEventosRequest(soloFuturos=solo_futuros)
        try:
            md = _auth_metadata(token)
            if md:
                response, _ = self.stub.listarEventos.with_call(request, metadata=md)
            else:
                response, _ = self.stub.listarEventos.with_call(request)
            logger.info(
                f"[gRPC RESPONSE] Eventos encontrados: {len(response.eventos)} eventos"
            )
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al listar eventos: {e.code()} - {e.details()}"
            )
            raise

    def buscar_evento_por_id(self, evento_id, token):
        logger.info(f"[gRPC CLIENT] Buscando evento por ID: {evento_id}")
        md = _auth_metadata(token)
        request = evento_pb2.BuscarEventoPorIdRequest(id=evento_id)
        try:
            response, _ = self.stub.buscarEventoPorId.with_call(request, metadata=md)
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al buscar evento ID {evento_id}: {e.code()} - {e.details()}"
            )
            raise

    def asignar_participante(self, evento_id, usuario_id, token):
        logger.info(
            f"[gRPC CLIENT] Asignando participante - Evento: {evento_id}, Usuario: {usuario_id}"
        )
        md = _auth_metadata(token)
        request = evento_pb2.AsignarParticipanteRequest(
            eventoId=evento_id, usuarioId=usuario_id
        )
        try:
            response, _ = self.stub.asignarParticipante.with_call(request, metadata=md)
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al asignar participante Evento {evento_id}, Usuario {usuario_id}: {e.code()} - {e.details()}"
            )
            raise

    def quitar_participante(self, evento_id, usuario_id, token):
        logger.info(
            f"[gRPC CLIENT] Quitando participante - Evento: {evento_id}, Usuario: {usuario_id}"
        )
        md = _auth_metadata(token)
        request = evento_pb2.QuitarParticipanteRequest(
            eventoId=evento_id, usuarioId=usuario_id
        )
        try:
            response, _ = self.stub.quitarParticipante.with_call(request, metadata=md)
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al quitar participante Evento {evento_id}, Usuario {usuario_id}: {e.code()} - {e.details()}"
            )
            raise

    def registrar_donacion_repartida(
        self, evento_id, categoria, descripcion, cantidad, token
    ):
        logger.info(
            f"[gRPC CLIENT] Registrando donación - Evento: {evento_id}, Categoría: {categoria}, Cantidad: {cantidad}"
        )
        md = _auth_metadata(token)
        categoria_map = {
            "ROPA": evento_pb2.CategoriaDonacion.ROPA,
            "ALIMENTOS": evento_pb2.CategoriaDonacion.ALIMENTOS,
            "JUGUETES": evento_pb2.CategoriaDonacion.JUGUETES,
            "UTILES_ESCOLARES": evento_pb2.CategoriaDonacion.UTILES_ESCOLARES,
        }
        request = evento_pb2.RegistrarDonacionRequest(
            eventoId=evento_id,
            categoria=categoria_map.get(categoria, evento_pb2.CategoriaDonacion.ROPA),
            descripcion=descripcion,
            cantidad=cantidad,
        )
        try:
            response, _ = self.stub.registrarDonacionRepartida.with_call(
                request, metadata=md
            )
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al registrar donación Evento {evento_id}: {e.code()} - {e.details()}"
            )
            raise

    def eliminar_evento(self, evento_id, token):
        logger.info(f"[gRPC CLIENT] Eliminando evento ID: {evento_id}")
        md = _auth_metadata(token)
        request = evento_pb2.BuscarEventoPorIdRequest(id=evento_id)
        try:
            response, _ = self.stub.eliminarEvento.with_call(request, metadata=md)
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al eliminar evento ID {evento_id}: {e.code()} - {e.details()}"
            )
            raise

    def modificar_evento(self, evento_data, token):
        logger.info(f"[gRPC CLIENT] Modificando evento ID: {evento_data.get('id')}")
        md = _auth_metadata(token)
        request = evento_pb2.Evento(
            id=evento_data["id"],
            nombreEvento=evento_data["nombreEvento"],
            descripcion=evento_data["descripcion"],
            fechaHoraEvento=evento_data["fechaHoraEvento"],
            participantesIds=evento_data.get("participantesIds", []),
            fechaCreacion=evento_data.get("fechaCreacion", 0),
            usuarioCreacion=evento_data.get("usuarioCreacion", 0),
            activo=evento_data.get("activo", True),
        )
        try:
            response, _ = self.stub.modificarEvento.with_call(request, metadata=md)
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al modificar evento ID {evento_data.get('id')}: {e.code()} - {e.details()}"
            )
            raise
    def verificar_adhesion(self, id_evento: str, id_voluntario: int, token: str):
        logger.info(
            f"[gRPC CLIENT] Verificando adhesión - Evento: {id_evento}, Voluntario: {id_voluntario}"
        )
        md = _auth_metadata(token)
        request = evento_pb2.VerificarAdhesionRequest(
            idEvento=id_evento,
            idVoluntario=id_voluntario
        )
        try:
            response, _ = self.stub.VerificarAdhesion.with_call(request, metadata=md)
            logger.info(f"[gRPC RESPONSE] Adhesión verificada - Adherido: {response.adherido}")
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al verificar adhesión Evento {id_evento}, Voluntario {id_voluntario}: {e.code()} - {e.details()}"
            )
            raise


if __name__ == "__main__":
    # Test del cliente
    client = EventoClient()

    # Ejemplo de uso
    try:
        print("Cliente de eventos inicializado correctamente")
        print(f"Conectando a: {client.host}:{client.server_port}")
    except Exception as e:
        print(f"Error inicializando cliente: {e}")

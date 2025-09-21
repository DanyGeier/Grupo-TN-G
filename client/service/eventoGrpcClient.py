import os
import grpc
import logging
from proto import evento_pb2, evento_pb2_grpc
from google.protobuf.json_format import MessageToJson

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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
        """
        Crear un nuevo evento
        """
        logger.info(f"[gRPC CLIENT] Iniciando creación de evento: {nombre_evento}")
        logger.info(
            f"[JWT PROPAGATION] Token recibido: {'Token presente' if token else 'Sin token'}"
        )
        if token:
            logger.info(f"[JWT PROPAGATION] Token longitud: {len(token)}")
            logger.info(f"[JWT PROPAGATION] Token (primeros 50 chars): {token[:50]}...")

        request = evento_pb2.CrearEventoRequest(
            nombreEvento=nombre_evento,
            descripcion=descripcion,
            fechaHoraEvento=fecha_hora_evento,
        )

        logger.info(
            f"[gRPC REQUEST] crearEvento - Nombre: {nombre_evento}, Fecha: {fecha_hora_evento}"
        )
        logger.debug(f"[gRPC REQUEST] Request completo: {MessageToJson(request)}")
        logger.info(f"[JWT PROPAGATION] Enviando token en metadata de autorización")

        try:
            if token:
                metadata = [("authorization", token)]
                logger.info(
                    f"[JWT PROPAGATION] Metadata creada con token de autorización"
                )
                response, call = self.stub.crearEvento.with_call(
                    request, metadata=metadata
                )
            else:
                logger.warning(f"[JWT PROPAGATION] WARNING: Enviando request sin token")
                response, call = self.stub.crearEvento.with_call(request)

            logger.info(
                f"[gRPC RESPONSE] Evento creado exitosamente - ID: {response.id}, Nombre: {response.nombreEvento}"
            )
            logger.debug(
                f"[gRPC RESPONSE] Response completo: {MessageToJson(response)}"
            )
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al crear evento {nombre_evento}: {e.code()} - {e.details()}"
            )
            raise

    def listar_eventos(self, solo_futuros=False, token=None):
        """
        Listar eventos, opcionalmente solo los futuros
        """
        logger.info(
            f"[gRPC CLIENT] Iniciando listado de eventos - Solo futuros: {solo_futuros}"
        )
        logger.info(
            f"[JWT PROPAGATION] Token recibido: {'Token presente' if token else 'Sin token'}"
        )
        if token:
            logger.info(f"[JWT PROPAGATION] Token longitud: {len(token)}")
            logger.info(f"[JWT PROPAGATION] Token (primeros 50 chars): {token[:50]}...")

        request = evento_pb2.ListarEventosRequest(soloFuturos=solo_futuros)

        logger.info(f"[gRPC REQUEST] listarEventos - Solo futuros: {solo_futuros}")
        logger.debug(f"[gRPC REQUEST] Request completo: {MessageToJson(request)}")
        logger.info(f"[JWT PROPAGATION] Enviando token en metadata de autorización")

        try:
            if token:
                metadata = [("authorization", token)]
                logger.info(
                    f"[JWT PROPAGATION] Metadata creada con token de autorización"
                )
                response, call = self.stub.listarEventos.with_call(
                    request, metadata=metadata
                )
            else:
                logger.warning(f"[JWT PROPAGATION] WARNING: Enviando request sin token")
                response, call = self.stub.listarEventos.with_call(request)

            logger.info(
                f"[gRPC RESPONSE] Eventos encontrados: {len(response.eventos)} eventos"
            )
            logger.debug(
                f"[gRPC RESPONSE] Response completo: {MessageToJson(response)}"
            )
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al listar eventos: {e.code()} - {e.details()}"
            )
            raise

    def buscar_evento_por_id(self, evento_id, token):
        """
        Buscar un evento por su ID
        """
        logger.info(f"[gRPC CLIENT] Iniciando búsqueda de evento por ID: {evento_id}")
        logger.info(
            f"[JWT PROPAGATION] Token recibido: {'Token presente' if token else 'Sin token'}"
        )
        if token:
            logger.info(f"[JWT PROPAGATION] Token longitud: {len(token)}")
            logger.info(f"[JWT PROPAGATION] Token (primeros 50 chars): {token[:50]}...")

        metadata = [("authorization", token)]
        request = evento_pb2.BuscarEventoPorIdRequest(id=evento_id)

        logger.info(f"[gRPC REQUEST] buscarEventoPorId - ID: {evento_id}")
        logger.debug(f"[gRPC REQUEST] Request completo: {MessageToJson(request)}")
        logger.info(f"[JWT PROPAGATION] Metadata creada con token de autorización")

        try:
            response, call = self.stub.buscarEventoPorId.with_call(
                request, metadata=metadata
            )
            logger.info(
                f"[gRPC RESPONSE] Evento encontrado - ID: {response.id}, Nombre: {response.nombreEvento}"
            )
            logger.debug(
                f"[gRPC RESPONSE] Response completo: {MessageToJson(response)}"
            )
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al buscar evento ID {evento_id}: {e.code()} - {e.details()}"
            )
            raise

    def asignar_participante(self, evento_id, usuario_id, token):
        """
        Asignar un participante a un evento
        """
        logger.info(
            f"[gRPC CLIENT] Iniciando asignación de participante - Evento: {evento_id}, Usuario: {usuario_id}"
        )
        logger.info(
            f"[JWT PROPAGATION] Token recibido: {'Token presente' if token else 'Sin token'}"
        )
        if token:
            logger.info(f"[JWT PROPAGATION] Token longitud: {len(token)}")
            logger.info(f"[JWT PROPAGATION] Token (primeros 50 chars): {token[:50]}...")

        metadata = [("authorization", token)]
        request = evento_pb2.AsignarParticipanteRequest(
            eventoId=evento_id, usuarioId=usuario_id
        )

        logger.info(
            f"[gRPC REQUEST] asignarParticipante - Evento: {evento_id}, Usuario: {usuario_id}"
        )
        logger.debug(f"[gRPC REQUEST] Request completo: {MessageToJson(request)}")
        logger.info(f"[JWT PROPAGATION] Metadata creada con token de autorización")

        try:
            response, call = self.stub.asignarParticipante.with_call(
                request, metadata=metadata
            )
            logger.info(
                f"[gRPC RESPONSE] Participante asignado exitosamente - Evento: {evento_id}, Usuario: {usuario_id}"
            )
            logger.debug(
                f"[gRPC RESPONSE] Response completo: {MessageToJson(response)}"
            )
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al asignar participante Evento {evento_id}, Usuario {usuario_id}: {e.code()} - {e.details()}"
            )
            raise

    def quitar_participante(self, evento_id, usuario_id, token):
        """
        Quitar un participante de un evento
        """
        logger.info(
            f"[gRPC CLIENT] Iniciando eliminación de participante - Evento: {evento_id}, Usuario: {usuario_id}"
        )
        logger.info(
            f"[JWT PROPAGATION] Token recibido: {'Token presente' if token else 'Sin token'}"
        )
        if token:
            logger.info(f"[JWT PROPAGATION] Token longitud: {len(token)}")
            logger.info(f"[JWT PROPAGATION] Token (primeros 50 chars): {token[:50]}...")

        metadata = [("authorization", token)]
        request = evento_pb2.QuitarParticipanteRequest(
            eventoId=evento_id, usuarioId=usuario_id
        )

        logger.info(
            f"[gRPC REQUEST] quitarParticipante - Evento: {evento_id}, Usuario: {usuario_id}"
        )
        logger.debug(f"[gRPC REQUEST] Request completo: {MessageToJson(request)}")
        logger.info(f"[JWT PROPAGATION] Metadata creada con token de autorización")

        try:
            response, call = self.stub.quitarParticipante.with_call(
                request, metadata=metadata
            )
            logger.info(
                f"[gRPC RESPONSE] Participante eliminado exitosamente - Evento: {evento_id}, Usuario: {usuario_id}"
            )
            logger.debug(
                f"[gRPC RESPONSE] Response completo: {MessageToJson(response)}"
            )
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al quitar participante Evento {evento_id}, Usuario {usuario_id}: {e.code()} - {e.details()}"
            )
            raise

    def registrar_donacion_repartida(
        self, evento_id, categoria, descripcion, cantidad, token
    ):
        """
        Registrar una donación repartida en un evento
        """
        logger.info(
            f"[gRPC CLIENT] Iniciando registro de donación - Evento: {evento_id}, Categoría: {categoria}, Cantidad: {cantidad}"
        )
        logger.info(
            f"[JWT PROPAGATION] Token recibido: {'Token presente' if token else 'Sin token'}"
        )
        if token:
            logger.info(f"[JWT PROPAGATION] Token longitud: {len(token)}")
            logger.info(f"[JWT PROPAGATION] Token (primeros 50 chars): {token[:50]}...")

        metadata = [("authorization", token)]

        # Mapear categoría string a enum
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

        logger.info(
            f"[gRPC REQUEST] registrarDonacionRepartida - Evento: {evento_id}, Categoría: {categoria}, Cantidad: {cantidad}"
        )
        logger.debug(f"[gRPC REQUEST] Request completo: {MessageToJson(request)}")
        logger.info(f"[JWT PROPAGATION] Metadata creada con token de autorización")

        try:
            response, call = self.stub.registrarDonacionRepartida.with_call(
                request, metadata=metadata
            )
            logger.info(
                f"[gRPC RESPONSE] Donación registrada exitosamente - Evento: {evento_id}, Categoría: {categoria}"
            )
            logger.debug(
                f"[gRPC RESPONSE] Response completo: {MessageToJson(response)}"
            )
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al registrar donación Evento {evento_id}: {e.code()} - {e.details()}"
            )
            raise

    def eliminar_evento(self, evento_id, token):
        """
        Eliminar un evento
        """
        logger.info(f"[gRPC CLIENT] Iniciando eliminación de evento ID: {evento_id}")
        logger.info(
            f"[JWT PROPAGATION] Token recibido: {'Token presente' if token else 'Sin token'}"
        )
        if token:
            logger.info(f"[JWT PROPAGATION] Token longitud: {len(token)}")
            logger.info(f"[JWT PROPAGATION] Token (primeros 50 chars): {token[:50]}...")

        metadata = [("authorization", token)]
        request = evento_pb2.BuscarEventoPorIdRequest(id=evento_id)

        logger.info(f"[gRPC REQUEST] eliminarEvento - ID: {evento_id}")
        logger.debug(f"[gRPC REQUEST] Request completo: {MessageToJson(request)}")
        logger.info(f"[JWT PROPAGATION] Metadata creada con token de autorización")

        try:
            response, call = self.stub.eliminarEvento.with_call(
                request, metadata=metadata
            )
            logger.info(
                f"[gRPC RESPONSE] Evento eliminado exitosamente - ID: {evento_id}"
            )
            logger.debug(
                f"[gRPC RESPONSE] Response completo: {MessageToJson(response)}"
            )
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al eliminar evento ID {evento_id}: {e.code()} - {e.details()}"
            )
            raise

    def modificar_evento(self, evento_data, token):
        """
        Modificar un evento existente
        """
        evento_id = evento_data.get("id", "N/A")
        logger.info(f"[gRPC CLIENT] Iniciando modificación de evento ID: {evento_id}")
        logger.info(
            f"[JWT PROPAGATION] Token recibido: {'Token presente' if token else 'Sin token'}"
        )
        if token:
            logger.info(f"[JWT PROPAGATION] Token longitud: {len(token)}")
            logger.info(f"[JWT PROPAGATION] Token (primeros 50 chars): {token[:50]}...")

        metadata = [("authorization", token)]
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

        logger.info(
            f"[gRPC REQUEST] modificarEvento - ID: {evento_id}, Nombre: {evento_data.get('nombreEvento')}"
        )
        logger.debug(f"[gRPC REQUEST] Request completo: {MessageToJson(request)}")
        logger.info(f"[JWT PROPAGATION] Metadata creada con token de autorización")

        try:
            response, call = self.stub.modificarEvento.with_call(
                request, metadata=metadata
            )
            logger.info(
                f"[gRPC RESPONSE] Evento modificado exitosamente - ID: {response.id}, Nombre: {response.nombreEvento}"
            )
            logger.debug(
                f"[gRPC RESPONSE] Response completo: {MessageToJson(response)}"
            )
            return response
        except grpc.RpcError as e:
            logger.error(
                f"[gRPC ERROR] Error al modificar evento ID {evento_id}: {e.code()} - {e.details()}"
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

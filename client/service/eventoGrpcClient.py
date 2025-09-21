import os
import grpc
from proto import evento_pb2, evento_pb2_grpc


class EventoClient(object):
    """
    Cliente gRPC para el servicio de eventos
    """

    def __init__(self):
        self.host = os.getenv("EVENTOS_GRPC_HOST", "localhost")
        self.server_port = os.getenv("EVENTOS_GRPC_PORT", "9096")

        # Crear un canal
        self.channel = grpc.insecure_channel(f"{self.host}:{self.server_port}")

        # Crear un stub
        self.stub = evento_pb2_grpc.EventoServiceStub(self.channel)

    def crear_evento(self, nombre_evento, descripcion, fecha_hora_evento, token):
        """
        Crear un nuevo evento
        """
        request = evento_pb2.CrearEventoRequest(
            nombreEvento=nombre_evento,
            descripcion=descripcion,
            fechaHoraEvento=fecha_hora_evento,
        )

        if token:
            metadata = [("authorization", token)]
            response = self.stub.crearEvento(request, metadata=metadata)
        else:
            response = self.stub.crearEvento(request)
        return response

    def listar_eventos(self, solo_futuros=False, token=None):
        """
        Listar eventos, opcionalmente solo los futuros
        """
        request = evento_pb2.ListarEventosRequest(soloFuturos=solo_futuros)

        if token:
            metadata = [("authorization", token)]
            response = self.stub.listarEventos(request, metadata=metadata)
        else:
            response = self.stub.listarEventos(request)
        return response

    def buscar_evento_por_id(self, evento_id, token):
        """
        Buscar un evento por su ID
        """
        metadata = [("authorization", token)]

        request = evento_pb2.BuscarEventoPorIdRequest(id=evento_id)
        response = self.stub.buscarEventoPorId(request, metadata=metadata)
        return response

    def asignar_participante(self, evento_id, usuario_id, token):
        """
        Asignar un participante a un evento
        """
        metadata = [("authorization", token)]

        request = evento_pb2.AsignarParticipanteRequest(
            eventoId=evento_id, usuarioId=usuario_id
        )

        response = self.stub.asignarParticipante(request, metadata=metadata)
        return response

    def quitar_participante(self, evento_id, usuario_id, token):
        """
        Quitar un participante de un evento
        """
        metadata = [("authorization", token)]

        request = evento_pb2.QuitarParticipanteRequest(
            eventoId=evento_id, usuarioId=usuario_id
        )

        response = self.stub.quitarParticipante(request, metadata=metadata)
        return response

    def registrar_donacion_repartida(
        self, evento_id, categoria, descripcion, cantidad, token
    ):
        """
        Registrar una donación repartida en un evento
        """
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

        response = self.stub.registrarDonacionRepartida(request, metadata=metadata)
        return response

    def eliminar_evento(self, evento_id, token):
        """
        Eliminar un evento
        """
        metadata = [("authorization", token)]

        request = evento_pb2.BuscarEventoPorIdRequest(id=evento_id)
        response = self.stub.eliminarEvento(request, metadata=metadata)
        return response

    def modificar_evento(self, evento_data, token):
        """
        Modificar un evento existente
        """
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

        response = self.stub.modificarEvento(request, metadata=metadata)
        return response


if __name__ == "__main__":
    # Test del cliente
    client = EventoClient()

    # Ejemplo de uso
    try:
        print("Cliente de eventos inicializado correctamente")
        print(f"Conectando a: {client.host}:{client.server_port}")
    except Exception as e:
        print(f"Error inicializando cliente: {e}")



import os
import grpc
from proto import usuario_pb2
from proto import usuario_pb2_grpc
from google.protobuf.json_format import MessageToJson


class UsuarioClient(object):

    def __init__(self):
        self.host = os.getenv("GRPC_SERVER_HOST", "localhost")
        self.server_port = os.getenv("GRPC_SERVER_PORT", "9095")

        #Crear un canal
        self.channel = grpc.insecure_channel(f"{self.host}:{self.server_port}")

        #Crear un stub
        self.stub = usuario_pb2_grpc.UsuarioServiceStub(self.channel)
    
    def registrarUsuario(self, usuario):
        request = usuario_pb2.CrearUsuarioRequest(
            nombreUsuario=usuario.nombreUsuario,
            nombre=usuario.nombre,
            apellido=usuario.apellido,
            telefono=usuario.telefono,
            email=usuario.email,
            rol=usuario.rol
        )
        response = self.stub.registrarUsuario(request)
        return response

    def listar_usuarios(self):
        """Listar todos los usuarios"""
        return self.stub.listarUsuarios(usuario_pb2.ListarUsuariosRequest())


if __name__ == '__main__':
    # Test del cliente
    client = UsuarioClient()
    
    # Ejemplo de uso
    try:
        usuarios = client.listar_usuarios()
        print("Usuarios encontrados:")
        print(MessageToJson(usuarios))
    except grpc.RpcError as e:
        print(f"Error gRPC: {e}")
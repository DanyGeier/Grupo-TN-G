import os
import grpc
from proto import autenticacion_pb2, autenticacion_pb2_grpc
from proto import usuario_pb2
from proto import usuario_pb2_grpc
from google.protobuf.json_format import MessageToJson


class UsuarioClient(object):

    def __init__(self):
        self.host = os.getenv("GRPC_SERVER_HOST", "localhost")
        self.server_port = os.getenv("GRPC_SERVER_PORT", "9095")

        # Crear un canal
        self.channel = grpc.insecure_channel(f"{self.host}:{self.server_port}")

        # Crear un stub
        self.stub = usuario_pb2_grpc.UsuarioServiceStub(self.channel)
        self.auth_stub = autenticacion_pb2_grpc.AuthenticationServiceStub(self.channel)

    def registrarUsuario(self, nombreUsuario, nombre, apellido, telefono, email, rol):
        request = usuario_pb2.CrearUsuarioRequest(
            nombreUsuario=nombreUsuario,
            nombre=nombre,
            apellido=apellido,
            telefono=telefono,
            email=email,
            rol=rol,
        )
        response = self.stub.registrarUsuario(request)
        return response

    def actualizarUsuario(
        self, id, nombreUsuario, nombre, apellido, telefono, email, rol, estado
    ):
        request = usuario_pb2.ActualizarUsuarioRequest(
            id=id,
            nombreUsuario=nombreUsuario,
            nombre=nombre,
            apellido=apellido,
            telefono=telefono,
            email=email,
            rol=rol,
            estado=estado,
        )
        response = self.stub.actualizarUsuario(request)
        return response

    def desactivarUsuario(self, id_usuario):
        request = usuario_pb2.BuscarUsuarioPorIdRequest(id=id_usuario)
        response = self.stub.desactivarUsuario(request)
        return response

    def buscarUsuarioPorId(self, id_usuario):
        request = usuario_pb2.BuscarUsuarioPorIdRequest(id=id_usuario)
        response = self.stub.buscarUsuarioPorId(request)
        return response

    def buscarUsuarioPorNombreUsuario(self, nombre_usuario: str):
        request = usuario_pb2.BuscarUsuarioPorNombreUsuarioRequest(
            nombreUsuario=nombre_usuario
        )
        response = self.stub.buscarUsuarioPorNombreUsuario(request)
        return response

    def listarUsuarios(self, estado=None):
        if estado is not None:
            request = usuario_pb2.ListarUsuariosRequest(estadoUsuario=estado)
        else:
            request = usuario_pb2.ListarUsuariosRequest()
        response = self.stub.listarUsuarios(request)
        return response

    def login(self, nombreUsuario, clave):
        request = autenticacion_pb2.LoginRequest(
            nombreUsuario=nombreUsuario, clave=clave
        )
        response = self.auth_stub.login(request)
        return response

    def logout(self, token):
        request = autenticacion_pb2.LogoutRequest(token=token)
        response = self.auth_stub.logout(request)
        return response


if __name__ == "__main__":
    # Test del cliente
    client = UsuarioClient()

    # Ejemplo de uso
    try:
        usuarios = client.listarUsuarios()
        print("Usuarios encontrados:")
        print(MessageToJson(usuarios))
    except grpc.RpcError as e:
        print(f"Error gRPC: {e}")

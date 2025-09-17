

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
    
    def registrarUsuario(self, nombreUsuario, nombre, apellido, telefono, email, rol):
        request = usuario_pb2.CrearUsuarioRequest(
            nombreUsuario=nombreUsuario,
            nombre=nombre,
            apellido=apellido,
            telefono=telefono,
            email=email,
            rol=rol
        )
        response = self.stub.registrarUsuario(request)
        return response

    def actualizarUsuario(self, id, nombreUsuario, nombre, apellido, telefono, email, rol, estado):
        request = usuario_pb2.ActualizarUsuarioRequest(
            id=id,
            nombreUsuario=nombreUsuario,
            nombre=nombre,
            apellido=apellido,
            telefono=telefono,
            email=email,
            rol=rol,
            estado=estado
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

    def listarUsuarios(self, estado=None):
        if estado is not None:
            request = usuario_pb2.ListarUsuariosRequest(estadoUsuario=estado)
        else:
            request = usuario_pb2.ListarUsuariosRequest()
        response = self.stub.listarUsuarios(request)
        return response

    def autenticarUsuario(self, nombreUsuario, clave):
        request = usuario_pb2.LoginData(
            nombreUsuario=nombreUsuario,
            clave=clave
        )
        response = self.stub.autenticarUsuario(request)
        return response



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
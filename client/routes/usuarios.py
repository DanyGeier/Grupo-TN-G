from flask import Blueprint, request, jsonify
from service.grpcClient import UsuarioClient
from proto import usuario_pb2

# Crear blueprint para usuarios
usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/usuarios")

# Cliente gRPC para usuarios
usuario_client = UsuarioClient()


@usuarios_bp.route("", methods=["GET"])
def listar_usuarios():
    """Listar todos los usuarios"""
    try:
        usuarios = usuario_client.listarUsuarios()
        usuarios_list = []
        for u in usuarios.usuarios:
            usuarios_list.append(
                {
                    "id": u.id,
                    "nombreUsuario": u.nombreUsuario,
                    "nombre": u.nombre,
                    "apellido": u.apellido,
                    "email": u.email,
                    "rol": u.rol,
                    "estado": u.estado,
                }
            )
        return jsonify({"usuarios": usuarios_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@usuarios_bp.route("/<int:usuario_id>", methods=["GET"])
def buscar_usuario(usuario_id):
    """Buscar usuario por ID"""
    try:
        usuario = usuario_client.buscarUsuarioPorId(usuario_id)
        return jsonify(
            {
                "id": usuario.id,
                "nombreUsuario": usuario.nombreUsuario,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "email": usuario.email,
                "rol": usuario.rol,
                "estado": usuario.estado,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@usuarios_bp.route("", methods=["POST"])
def registrar_usuario():
    """Registrar nuevo usuario"""
    try:
        data = request.get_json()
        rol_map = {
            "PRESIDENTE": usuario_pb2.Rol.PRESIDENTE,
            "VOCAL": usuario_pb2.Rol.VOCAL,
            "COORDINADOR": usuario_pb2.Rol.COORDINADOR,
            "VOLUNTARIO": usuario_pb2.Rol.VOLUNTARIO,
        }

        usuario = usuario_client.registrarUsuario(
            data["nombreUsuario"],
            data["nombre"],
            data["apellido"],
            data.get("telefono", ""),
            data["email"],
            rol_map[data["rol"]],
        )

        return jsonify(
            {
                "id": usuario.id,
                "nombreUsuario": usuario.nombreUsuario,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "email": usuario.email,
                "rol": usuario.rol,
                "estado": usuario.estado,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@usuarios_bp.route("/<int:usuario_id>", methods=["PUT"])
def actualizar_usuario(usuario_id):
    """Actualizar usuario existente"""
    try:
        data = request.get_json()
        rol_map = {
            "PRESIDENTE": usuario_pb2.Rol.PRESIDENTE,
            "VOCAL": usuario_pb2.Rol.VOCAL,
            "COORDINADOR": usuario_pb2.Rol.COORDINADOR,
            "VOLUNTARIO": usuario_pb2.Rol.VOLUNTARIO,
        }
        estado_map = {
            "ACTIVO": usuario_pb2.EstadoUsuario.ACTIVO,
            "INACTIVO": usuario_pb2.EstadoUsuario.INACTIVO,
            "SUSPENDIDO": usuario_pb2.EstadoUsuario.SUSPENDIDO,
        }

        usuario = usuario_client.actualizarUsuario(
            usuario_id,
            data["nombreUsuario"],
            data["nombre"],
            data["apellido"],
            data.get("telefono", ""),
            data["email"],
            rol_map[data["rol"]],
            estado_map[data["estado"]],
        )

        return jsonify(
            {
                "id": usuario.id,
                "nombreUsuario": usuario.nombreUsuario,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "email": usuario.email,
                "rol": usuario.rol,
                "estado": usuario.estado,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@usuarios_bp.route("/<int:usuario_id>", methods=["DELETE"])
def desactivar_usuario(usuario_id):
    """Desactivar usuario"""
    try:
        resultado = usuario_client.desactivarUsuario(usuario_id)
        return jsonify({"message": resultado.mensaje})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from flask import Blueprint, request, jsonify
from service.grpcClient import UsuarioClient
from service.eventoGrpcClient import EventoClient
from service.jwt_utils import require_role, extract_bearer_token
from proto import usuario_pb2
import grpc

# Crear blueprint para usuarios
usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/usuarios")

# Clientes gRPC
usuario_client = UsuarioClient()
evento_client = EventoClient()


@usuarios_bp.route("", methods=["GET"])
def listar_usuarios():
    """Listar todos los usuarios (solo PRESIDENTE)"""
    user, err = require_role([0])  # PRESIDENTE
    if err:
        return err
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
    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@usuarios_bp.route("/activos", methods=["GET"])
def listar_usuarios_activos():
    """Listar usuarios activos (PRESIDENTE o COORDINADOR)"""
    user, err = require_role([0, 2])  # PRESIDENTE o COORDINADOR
    if err:
        return err
    try:
        usuarios = usuario_client.listarUsuarios(usuario_pb2.EstadoUsuario.ACTIVO)
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
    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@usuarios_bp.route("/<int:usuario_id>", methods=["GET"])
def buscar_usuario(usuario_id):
    """Buscar usuario por ID (solo PRESIDENTE)"""
    user, err = require_role([0])
    if err:
        return err
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
    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@usuarios_bp.route("", methods=["POST"])
def registrar_usuario():
    """Registrar nuevo usuario (solo PRESIDENTE)"""
    user, err = require_role([0])
    if err:
        return err
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
        ), 201
    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@usuarios_bp.route("/<int:usuario_id>", methods=["PUT"])
def actualizar_usuario(usuario_id):
    """Actualizar usuario existente (solo PRESIDENTE)"""
    user, err = require_role([0])
    if err:
        return err
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
    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@usuarios_bp.route("/<int:usuario_id>", methods=["DELETE"])
def desactivar_usuario(usuario_id):
    """Desactivar usuario (solo PRESIDENTE) y quitarlo de eventos futuros"""
    user, err = require_role([0])
    if err:
        return err
    try:
        resultado = usuario_client.desactivarUsuario(usuario_id)

        # Regla: remover de eventos futuros
        token = extract_bearer_token()
        try:
            eventos = evento_client.listar_eventos(True, token)  # soloFuturos=True
            for ev in eventos.eventos:
                if usuario_id in list(ev.participantesIds):
                    try:
                        evento_client.quitar_participante(ev.id, usuario_id, token)
                    except grpc.RpcError:
                        pass
        except grpc.RpcError:
            pass

        return jsonify({"message": resultado.mensaje})
    except grpc.RpcError as e:
        return jsonify({"error": e.details() or "Error gRPC"}), _map_grpc_status(e)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def _map_grpc_status(e: grpc.RpcError) -> int:
    code = e.code().name if hasattr(e, "code") else None
    if code == "ALREADY_EXISTS":
        return 409
    if code == "NOT_FOUND":
        return 404
    if code == "UNAUTHENTICATED":
        return 401
    if code == "PERMISSION_DENIED":
        return 403
    if code == "INVALID_ARGUMENT":
        return 400
    return 500

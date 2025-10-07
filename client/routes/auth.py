from flask import Blueprint, request, jsonify
from service.grpcClient import UsuarioClient
import grpc
from service.jwt_utils import get_current_user

# Crear blueprint para autenticación
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

# Cliente gRPC para usuarios (usado para login)
usuario_client = UsuarioClient()


@auth_bp.route("/login", methods=["POST"])
def autenticar_usuario():
    """Autenticar usuario (usuario o email) y obtener token JWT"""
    try:
        data = request.get_json()
        response = usuario_client.login(data["nombreUsuario"], data["clave"])  # nombreUsuario puede ser email
        return jsonify(
            {
                "usuario": {
                    "id": response.usuario.id,
                    "nombreUsuario": response.usuario.nombreUsuario,
                    "nombre": response.usuario.nombre,
                    "apellido": response.usuario.apellido,
                    "email": response.usuario.email,
                    "rol": response.usuario.rol,
                    "estado": response.usuario.estado,
                },
                "token": response.token,
            }
        )
    except grpc.RpcError as e:
        code = e.code().name if hasattr(e, "code") else None
        msg = e.details() or "Error autenticando"
        if code == "NOT_FOUND":
            return jsonify({"error": "Usuario/email inexistente o inactivo"}), 404
        if code == "UNAUTHENTICATED":
            return jsonify({"error": "Credenciales incorrectas"}), 401
        return jsonify({"error": msg}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/me", methods=["GET"])
def whoami():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Token de autorización requerido o inválido"}), 401
    return jsonify(user)

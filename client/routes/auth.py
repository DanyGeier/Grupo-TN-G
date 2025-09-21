from flask import Blueprint, request, jsonify
from service.grpcClient import UsuarioClient

# Crear blueprint para autenticación
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

# Cliente gRPC para usuarios (usado para login)
usuario_client = UsuarioClient()


@auth_bp.route("/login", methods=["POST"])
def autenticar_usuario():
    """Autenticar usuario y obtener token JWT"""
    try:
        data = request.get_json()
        response = usuario_client.login(data["nombreUsuario"], data["clave"])
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from flask import Flask, request, jsonify
from service.grpcClient import UsuarioClient
from proto import usuario_pb2
from flask_cors import CORS


app = Flask(__name__)
client = UsuarioClient()
CORS(app, origins="http://localhost:5173")  # Permite CORS desde React

@app.route("/")
def home():
    return jsonify({"message": "API Usuarios - Grupo TN-G"})


@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    try:
        usuarios = client.listarUsuarios()
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


@app.route("/usuarios/<int:usuario_id>", methods=["GET"])
def buscar_usuario(usuario_id):
    try:
        usuario = client.buscarUsuarioPorId(usuario_id)
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


@app.route("/usuarios", methods=["POST"])
def registrar_usuario():
    try:
        data = request.get_json()
        rol_map = {
            "PRESIDENTE": usuario_pb2.Rol.PRESIDENTE,
            "VOCAL": usuario_pb2.Rol.VOCAL,
            "COORDINADOR": usuario_pb2.Rol.COORDINADOR,
            "VOLUNTARIO": usuario_pb2.Rol.VOLUNTARIO,
        }

        usuario = client.registrarUsuario(
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


@app.route("/usuarios/<int:usuario_id>", methods=["PUT"])
def actualizar_usuario(usuario_id):
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

        usuario = client.actualizarUsuario(
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


@app.route("/usuarios/<int:usuario_id>", methods=["DELETE"])
def desactivar_usuario(usuario_id):
    try:
        resultado = client.desactivarUsuario(usuario_id)
        return jsonify({"message": resultado.mensaje})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/auth/login", methods=["POST"])
def autenticar_usuario():
    try:
        data = request.get_json()
        response = client.login(data["nombreUsuario"], data["clave"])
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


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
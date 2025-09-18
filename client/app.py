from flask import Flask, request, jsonify
from flask_cors import CORS
from service.grpcClient import UsuarioClient
from proto import usuario_pb2

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")  # Permite CORS desde React
client = UsuarioClient()

@app.route("/")
def home():
    return jsonify({"message": "API Usuarios - Grupo TN-G"})

@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    try:
        usuarios = client.listarUsuarios()
        usuarios_list = [
            {
                "id": u.id,
                "nombreUsuario": u.nombreUsuario,
                "nombre": u.nombre,
                "apellido": u.apellido,
                "email": u.email,
                "rol": u.rol,
                "estado": u.estado,
            }
            for u in usuarios.usuarios
        ]
        return jsonify({"usuarios": usuarios_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

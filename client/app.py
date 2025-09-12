from flask import Flask, jsonify

from grpcClient import UsuarioClient

app = Flask(__name__)



@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/')
def hola():
    userClient = UsuarioClient()
    usuarios = userClient.listar_usuarios()

    return "Hola te comunicaste con el cliente que obtiene usuarios: " + str(usuarios)


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True,port=5000)
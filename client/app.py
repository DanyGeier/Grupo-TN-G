from flask import Flask

from grpcClient import UsuarioClient

app = Flask(__name__)

@app.route('/')
def hola():
    userClient = UsuarioClient()
    usuarios = userClient.listar_usuarios()

    return "Hola te comunicaste con el cliente que obtiene usuarios: " + str(usuarios)


if __name__ == '__main__':
    app.run(debug=True,port=5000)
from flask import Flask, jsonify
from flask_cors import CORS
from routes.usuarios import usuarios_bp
from routes.eventos import eventos_bp
from routes.auth import auth_bp


def create_app():
    """Factory function para crear la aplicación Flask"""
    app = Flask(__name__)

    # Configurar CORS
    CORS(app, origins="http://localhost:5173")  # Permite CORS desde React

    # Registrar blueprints
    app.register_blueprint(usuarios_bp)
    app.register_blueprint(eventos_bp)
    app.register_blueprint(auth_bp)

    # Endpoint principal
    @app.route("/")
    def home():
        return jsonify({"message": "API Grupo TN-G - Sistema de Gestión"})

    # Endpoint de salud
    @app.route("/health")
    def health_check():
        return jsonify(
            {"status": "healthy", "service": "Grupo TN-G API", "version": "1.0.0"}
        )

    return app


# Crear instancia de la aplicación
app = create_app()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

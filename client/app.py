from flask import Flask, jsonify
from flask_cors import CORS
from routes.usuarios import usuarios_bp
from routes.eventos import eventos_bp
from routes.auth import auth_bp
from routes.inventario import inventario_bp
from routes.informes import informes_bp


def create_app():
    """Factory function para crear la aplicación Flask"""
    app = Flask(__name__)

    # Configurar CORS global para todos los orígenes (solo entorno dev)
    CORS(
        app,
        resources={
            r"/*": {
                "origins": "*",
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "expose_headers": ["Authorization"],
                "supports_credentials": False,
                "always_send": True,
            }
        },
    )

    # Registrar blueprints
    app.register_blueprint(usuarios_bp)
    app.register_blueprint(eventos_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(inventario_bp)
    app.register_blueprint(informes_bp)

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
// MongoDB initialization script for eventos service
db = db.getSiblingDB('eventos_db');

// Crear usuario para la aplicación
db.createUser({
    user: 'eventos_user',
    pwd: 'eventos_password',
    roles: [
        {
            role: 'readWrite',
            db: 'eventos_db'
        }
    ]
});

// Crear colecciones e índices
db.createCollection('eventos');

// Índices para optimizar consultas
db.eventos.createIndex({ "fecha_hora_evento": 1, "activo": 1 });
db.eventos.createIndex({ "participantes_ids": 1 });
db.eventos.createIndex({ "usuario_creacion": 1 });
db.eventos.createIndex({ "activo": 1 });

print('MongoDB initialization completed for eventos service');

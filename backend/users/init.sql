-- Script de inicialización de la base de datos
USE bd_empuje_comunitario;

-- Insertar roles por defecto (solo si no existen)
INSERT IGNORE INTO rol (nombre_rol) VALUES 
('PRESIDENTE'),
('VOCAL'),
('COORDINADOR'),
('VOLUNTARIO');

-- Insertar usuario PRESIDENTE por defecto
-- Usuario: admin
-- Contraseña: admin123
-- Hash BCrypt de "admin123": $2a$10$N9qo8uLOickgx2ZMRZoMye/IuXHb7Da8z7KGpO3BT8Gqp0hI8GqFS
INSERT IGNORE INTO usuarios (nombre_usuario, nombre, apellido, email, contrasenia, rol_id, activo) 
VALUES (
    'admin',
    'Administrador',
    'Sistema',
    'admin@grupo.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye/IuXHb7Da8z7KGpO3BT8Gqp0hI8GqFS',
    1,  -- PRESIDENTE
    1   -- activo
);
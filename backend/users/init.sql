-- Script de inicialización de la base de datos
USE bd_empuje_comunitario;

-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS rol (
    id_rol BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar roles por defecto
INSERT INTO rol (nombre_rol) VALUES 
('PRESIDENTE'),
('VOCAL'),
('COORDINADOR'),
('VOLUNTARIO')
ON DUPLICATE KEY UPDATE nombre_rol = VALUES(nombre_rol);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombreUsuario VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    contrasenia VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    rol_id BIGINT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES rol(id_rol)
);

-- Insertar usuario de prueba
INSERT INTO usuarios (nombreUsuario, nombre, apellido, telefono, contrasenia, email, rol_id, activo) VALUES 
('admin', 'Administrador', 'Sistema', '1234567890', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'admin@grupo-tn-g.com', 1, TRUE)
ON DUPLICATE KEY UPDATE nombreUsuario = VALUES(nombreUsuario);
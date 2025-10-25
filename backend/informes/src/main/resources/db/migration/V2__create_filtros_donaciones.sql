-- Script SQL para crear la tabla filtros_donaciones
-- Este script se ejecutará automáticamente si tienes Flyway configurado
-- O puedes ejecutarlo manualmente en MySQL

CREATE TABLE IF NOT EXISTS filtros_donaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_filtro VARCHAR(100) NOT NULL,
    usuario_id BIGINT NOT NULL,
    categoria VARCHAR(50) NULL,
    fecha_desde DATETIME NULL,
    fecha_hasta DATETIME NULL,
    eliminado BOOLEAN NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_fecha_creacion (fecha_creacion DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


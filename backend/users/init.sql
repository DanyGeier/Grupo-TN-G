-- Script de inicialización de la base de datos
USE bd_empuje_comunitario;

-- Insertar roles por defecto (solo si no existen)
INSERT IGNORE INTO rol (nombre_rol) VALUES 
('PRESIDENTE'),
('VOCAL'),
('COORDINADOR'),
('VOLUNTARIO');
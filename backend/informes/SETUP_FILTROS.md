# Setup de Filtros Personalizados

## Base de Datos

### Opción 1: Ejecutar SQL manualmente

Conectarse a MySQL y ejecutar:

```bash
docker compose exec -it db mysql -ugrupog -pgrupog123 bd_empuje_comunitario
```

Luego ejecutar el SQL:

```sql
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
```

### Opción 2: Cambiar ddl-auto temporalmente

Si prefieres que JPA cree la tabla automáticamente, modifica `application.yml`:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # Cambiar de 'none' a 'update'
```

**Importante**: Después de crear la tabla, volver a cambiar a `ddl-auto: none` para no perder datos en futuros deployments.


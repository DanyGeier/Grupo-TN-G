# Credenciales por Defecto

## Usuario Administrador (PRESIDENTE)

- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Email**: `admin@grupo.com`
- **Rol**: PRESIDENTE

### Roles disponibles

- `PRESIDENTE` - Acceso completo
- `VOCAL` - Gestión de eventos y participantes
- `COORDINADOR` - Coordinación de eventos
- `VOLUNTARIO` - Participación en eventos

## Reiniciar la base de datos

Si necesitas resetear la base de datos y crear el usuario nuevamente:

```bash
docker-compose down -v
docker-compose up --build
```

**Nota**: El flag `-v` elimina los volúmenes, borrando todos los datos de la base de datos.

## Cómo funciona

El usuario administrador se crea automáticamente mediante el componente `DataInitializer` de Spring Boot al iniciar la aplicación. Este componente:

1. Verifica si el usuario `admin` ya existe
2. Si no existe, crea los 4 roles (PRESIDENTE, VOCAL, COORDINADOR, VOLUNTARIO)
3. Crea el usuario admin con rol PRESIDENTE usando BCryptPasswordEncoder
4. Solo se ejecuta la primera vez que se inicia la aplicación



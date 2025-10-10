# Credenciales por Defecto

## Usuario Administrador (PRESIDENTE)

Cuando levantes Docker Compose, se creará automáticamente un usuario con rol PRESIDENTE:

- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Email**: `admin@grupo.com`
- **Rol**: PRESIDENTE

## Uso

### Login via CURL

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nombreUsuario": "admin",
    "clave": "admin123"
  }'
```

### Crear un nuevo usuario

```bash
# Primero obtener el token
TOKEN=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nombreUsuario":"admin","clave":"admin123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Luego crear el usuario
curl -X POST http://localhost:5000/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombreUsuario": "nuevoUsuario",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "1234567890",
    "email": "juan.perez@example.com",
    "rol": "VOLUNTARIO"
  }'
```

### Roles disponibles

- `PRESIDENTE` - Acceso completo
- `VOCAL` - Gestión de eventos y participantes
- `COORDINADOR` - Coordinación de eventos
- `VOLUNTARIO` - Participación en eventos

## Reiniciar la base de datos

Si necesitas resetear la base de datos y crear el usuario por defecto nuevamente:

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

En los logs del servidor verás: `✅ Usuario admin creado exitosamente` cuando se cree por primera vez.


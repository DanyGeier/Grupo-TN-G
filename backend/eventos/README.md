# Servicio de Eventos

Servicio de gestión de eventos solidarios para la ONG "Empuje Comunitario".

## Características

- **Base de datos**: MongoDB
- **Comunicación**: gRPC
- **Puerto gRPC**: 9096
- **Puerto Web**: 8082
- **Autenticación**: JWT via metadatos gRPC

## Funcionalidades

### Gestión de Eventos
- ✅ Crear eventos (solo fechas futuras)
- ✅ Modificar eventos
- ✅ Eliminar eventos (solo futuros, eliminación física)
- ✅ Listar eventos (con filtros)
- ✅ Buscar evento por ID

### Gestión de Participantes
- ✅ Asignar participantes según rol
- ✅ Quitar participantes según rol
- ✅ Validación de permisos por rol

### Registro de Donaciones
- ✅ Registrar donaciones repartidas en eventos pasados
- ✅ Descontar del inventario (via gRPC)
- ✅ Auditoría de donaciones

## Roles y Permisos

- **PRESIDENTE**: Puede hacer todo
- **COORDINADOR**: Puede crear/modificar/asignar participantes
- **VOLUNTARIO**: Solo puede asignarse/quitarse a sí mismo
- **VOCAL**: Solo lectura de eventos

## Estructura del Proyecto

```
backend/eventos/
├── src/main/java/com/grupog/
│   ├── configs/           # Configuraciones (JWT, gRPC)
│   ├── documents/         # Entidades MongoDB
│   ├── grpc/service/      # Servicios gRPC
│   ├── mappers/          # Conversores Entity ↔ Proto
│   ├── repositories/     # Repositorios MongoDB
│   ├── service/          # Clientes gRPC y servicios
│   └── EventosApplication.java
├── src/main/proto/       # Archivos Protocol Buffers
├── src/main/resources/   # Configuración de aplicación
├── Dockerfile
├── pom.xml
└── mongo-init.js        # Script de inicialización MongoDB
```

## Configuración

### Variables de Entorno
- `SPRING_DATA_MONGODB_HOST`: Host de MongoDB
- `SPRING_DATA_MONGODB_PORT`: Puerto de MongoDB (27017)
- `SPRING_DATA_MONGODB_DATABASE`: Base de datos (eventos_db)
- `SPRING_DATA_MONGODB_USERNAME`: Usuario de MongoDB
- `SPRING_DATA_MONGODB_PASSWORD`: Contraseña de MongoDB

### Clientes gRPC
- **usuarios-service**: Puerto 9095
- **inventario-service**: Puerto 9097 (pendiente de implementación)

## Desarrollo

### Compilar
```bash
./mvnw clean compile
```

### Generar código gRPC
```bash
./mvnw protobuf:compile
```

### Ejecutar tests
```bash
./mvnw test
```

### Construir imagen Docker
```bash
docker build -t eventos-service .
```

## Despliegue

El servicio se despliega automáticamente con Docker Compose:

```bash
docker-compose up eventos
```

## API gRPC

### Métodos Disponibles

1. **crearEvento** - Crear nuevo evento
2. **modificarEvento** - Modificar evento existente
3. **eliminarEvento** - Eliminar evento (solo futuros)
4. **listarEventos** - Listar eventos con filtros
5. **buscarEventoPorId** - Buscar evento específico
6. **asignarParticipante** - Asignar participante
7. **quitarParticipante** - Quitar participante
8. **registrarDonacionRepartida** - Registrar donación repartida

### Autenticación

Todos los métodos requieren token JWT en los metadatos gRPC:

```
Authorization: Bearer <token>
```

## Base de Datos

### Colección: eventos

```javascript
{
  "_id": "ObjectId",
  "nombre_evento": "string",
  "descripcion": "string",
  "fecha_hora_evento": "ISODate",
  "participantes_ids": ["Long"],
  "donaciones_repartidas": [
    {
      "categoria": "string",
      "descripcion": "string", 
      "cantidad_repartida": "int",
      "fecha_repartida": "ISODate",
      "usuario_repartida_id": "Long",
      "nombre_usuario_repartida": "string"
    }
  ],
  "fecha_creacion": "ISODate",
  "usuario_creacion": "Long",
  "activo": "boolean"
}
```

### Índices
- `{ "fecha_hora_evento": 1, "activo": 1 }`
- `{ "participantes_ids": 1 }`
- `{ "usuario_creacion": 1 }`
- `{ "activo": 1 }`

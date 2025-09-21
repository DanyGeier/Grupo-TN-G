# Empuje Comunitario - Sistema de Gestión ONG

Sistema web desarrollado para la gestión de actividades, donaciones y miembros de la ONG "Empuje Comunitario". Este proyecto forma parte de un trabajo práctico universitario sobre sistemas distribuidos utilizando gRPC.

## Descripción del Proyecto

El sistema permite gestionar las actividades de una ONG a través de diferentes roles de usuario, manejo de inventario de donaciones y coordinación de eventos solidarios. La arquitectura está diseñada como un sistema distribuido con múltiples servicios independientes que se comunican mediante gRPC.

## Arquitectura del Sistema

### Componentes Principales

- **Frontend (React + TypeScript)**: Interfaz web para operar con el sistema
- **API Gateway (Flask + Python)**: Recibe peticiones del frontend y coordina servicios
- **Servicio de Usuarios (Spring Boot + Java)**: Gestión de usuarios y autenticación
- **Servicio de Eventos (Spring Boot + Java)**: Gestión de eventos solidarios
- **Base de Datos MySQL**: Persistencia para usuarios
- **Base de Datos MongoDB**: Persistencia para eventos
- **Mailpit**: Servicio de correo para notificaciones

### Roles de Usuario

- **Presidente**: Gestión completa del sistema (usuarios, eventos, inventario)
- **Vocal**: Acceso al inventario de donaciones
- **Coordinador**: Coordinación de eventos solidarios
- **Voluntario**: Consulta y participación en eventos

### Funcionalidades Principales

1. **Gestión de Usuarios**: ABM con roles, autenticación y notificaciones por email
2. **Inventario de Donaciones**: Registro por categorías (ropa, alimentos, juguetes, útiles escolares)
3. **Eventos Solidarios**: Creación, modificación y participación en eventos comunitarios

## Tecnologías Utilizadas

- **Frontend**: React 19, TypeScript, TailwindCSS, Vite
- **Backend**: Spring Boot 3.5, Java 21
- **API Gateway**: Flask, Python 3.13
- **Comunicación**: gRPC con Protocol Buffers
- **Bases de Datos**: MySQL 8.0, MongoDB 7.0
- **Containerización**: Docker y Docker Compose
- **Autenticación**: JWT
- **Email**: Spring Mail con Mailpit

## Requisitos

- Docker Desktop (o Docker Engine + docker compose)
- Puertos libres: 5000, 8081, 8082, 9095, 9096, 3306, 3307, 27017, 1025, 8025

## Estructura del Proyecto

```
Grupo-TN-G/
├── frontend/                   # React + TypeScript
├── client/                     # API Gateway (Flask + Python)
├── backend/
│   ├── users/                  # Servicio de Usuarios (Spring Boot + Java)
│   └── eventos/                # Servicio de Eventos (Spring Boot + Java)
├── compose.yaml               # Orquestación de servicios
└── README.md                  # Este archivo
```

## Servicios y Puertos

- **Frontend React**: 5173 (desarrollo)
- **API Gateway**: 5000
- **Servicio Usuarios**: 8081 (HTTP), 9095 (gRPC)
- **Servicio Eventos**: 8082 (HTTP), 9096 (gRPC)
- **MySQL**: 3307
- **MongoDB**: 27017
- **Mailpit**: 1025 (SMTP), 8025 (Web UI)

## Instalación y Ejecución

### Prerequisitos
- Docker Desktop instalado y funcionando
- Puertos disponibles según se especifica arriba

### Levantar el Sistema Completo

1. **Clonar el repositorio:**
```bash
git clone <url-del-repo>
cd Grupo-TN-G
```

2. **Levantar todos los servicios:**
```bash
docker compose up --build
```

3. **Acceder a la aplicación:**
- **Frontend**: http://localhost:5173 (desarrollo)
- **API Gateway**: http://localhost:5000
- **Mailpit Web UI**: http://localhost:8025


### Verificar el Estado de los Servicios

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Verificar salud de la API
curl http://localhost:5000/health

# Verificar servicio de usuarios
curl http://localhost:8081/actuator/health

# Verificar servicio de eventos
curl http://localhost:8082/actuator/health
```

## Comandos Útiles

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f server
docker compose logs -f eventos
docker compose logs -f client

# Reiniciar todos los servicios
docker compose down && docker compose up --build

# Reset completo (incluye borrar datos de las bases de datos)
docker compose down -v && docker compose up --build

# Acceder a MySQL
docker compose exec -it db mysql -ugrupog -pgrupog123 bd_empuje_comunitario

# Acceder a MongoDB
docker compose exec -it mongodb mongosh -u admin -p admin123

# Verificar servicios gRPC
grpcurl -plaintext localhost:9095 list
grpcurl -plaintext localhost:9096 list
```

## Desarrollo

### Ejecutar Frontend en Modo Desarrollo

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en http://localhost:5173

### Comunicación gRPC

El sistema utiliza gRPC para la comunicación entre servicios:
- **Servicio Usuarios**: Puerto 9095
- **Servicio Eventos**: Puerto 9096
- **Protocol Buffers**: Definidos en `backend/*/src/main/proto/`

### Base de Datos

- **MySQL**: Para gestión de usuarios y roles
- **MongoDB**: Para gestión de eventos solidarios
- **Datos de prueba**: Se crean automáticamente al inicializar los contenedores

## Información del Trabajo Práctico

Este proyecto corresponde al Trabajo Práctico de la materia "Desarrollo de Software en Sistemas Distribuidos" de la Universidad Nacional de Lanús, enfocado en la implementación de sistemas distribuidos utilizando gRPC.

### Características Implementadas

✅ Sistema distribuido con múltiples servicios  
✅ Comunicación gRPC entre servicios  
✅ Diferentes tecnologías (Java, Python, TypeScript)  
✅ Gestión de usuarios con roles y permisos  
✅ Sistema de eventos solidarios  
✅ Inventario de donaciones  
✅ Autenticación JWT  
✅ Notificaciones por email  
✅ Interfaz web moderna con React  

---

**Grupo TN-G** - Universidad Nacional de Lanús

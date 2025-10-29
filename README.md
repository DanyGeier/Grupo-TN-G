# Grupo-TN-G — Guía de Setup con Docker

Esta guía permite levantar el backend de usuarios (Spring Boot + gRPC) y la base de datos MySQL con un solo comando usando Docker.

## Requisitos
- Docker Desktop (o Docker Engine + docker compose)
- Puertos libres: 8081 (HTTP), 9095 (gRPC), 3306 (MySQL)

## Servicios y puertos
- Backend Usuarios (Spring Boot + gRPC)
  - HTTP: 8081 (actuator, etc.)
  - gRPC: 9095
- MySQL: 3306

### Cliente (Flask + gRPC client)
- REST expuesto: 5000
- Conexión al backend gRPC: configurable por variables de entorno
  - `GRPC_SERVER_HOST` (por defecto: `localhost` fuera de Docker, `server` dentro de Docker Compose)
  - `GRPC_SERVER_PORT` (por defecto: `9095`)
  
Endpoints útiles del cliente:
- `GET /health` → chequeo simple
- `GET /` → prueba que consulta `listarUsuarios` por gRPC y devuelve el resultado

## Estructura relevante del repo
```
Grupo-TN-G/
├── compose.yaml                 # Orquestación (raíz)
├── README-DOCKER.md            # Esta guía
├── backend/
│   └── users/
│       ├── Dockerfile
│       ├── init.sql             # Opcional (se puede omitir)
│       └── src/
│           ├── main/java/com/grupog/GrupoGApplication.java
│           ├── main/java/com/grupog/grpc/service/UsuarioGrpcService.java
│           ├── main/java/com/grupog/repositories/UsuarioRepository.java
│           └── main/proto/usuario.proto
```

## docker compose (raíz del repo)
Usamos MySQL 8.0 (estable) y exponemos 8081/9095 para el backend.

```yaml
version: '3.8'

services:
  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    environment:
      - GRPC_SERVER_HOST=server
      - GRPC_SERVER_PORT=9095
    ports:
      - "5000:5000"
    depends_on:
      - backend-users
  db:
    image: mysql:8.0
    container_name: grupo-tn-g-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root123456
      MYSQL_DATABASE: bd_empuje_comunitario
      MYSQL_USER: grupog
      MYSQL_PASSWORD: grupog123
      TZ: America/Argentina/Buenos_Aires
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      # Opcional: habilitar solo si querés seed inicial
      # - ./backend/users/init.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h 127.0.0.1 -uroot -p$${MYSQL_ROOT_PASSWORD} || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10

  backend-users:
    build:
      context: ./backend/users
      dockerfile: Dockerfile
    container_name: grupo-tn-g-server
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/bd_empuje_comunitario?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: grupog
      SPRING_DATASOURCE_PASSWORD: grupog123
      GRPC_SERVER_PORT: 9095
    ports:
      - "8081:8081"
      - "9095:9095"

volumes:
  mysql-data:
```

Notas:
- El backend usa el host `db` en la URL JDBC (resolución por nombre dentro de la red de Docker).
- Evitamos `mysql:latest`; `8.0` es estable y compatible.
- Si activás `init.sql`, se ejecuta solo la primera vez (volumen vacío). Para re-ejecutarlo: `docker compose down -v && docker compose up --build`.

## Levantar el entorno (pasos)
1) Clonar y entrar al proyecto:
```bash
git clone <url-del-repo>
cd Grupo-TN-G
```

2) Levantar todo:
```bash
docker compose up --build
```

3) Confirmar en logs:
- MySQL “ready for connections” y saludable.
- Backend:
  - “HikariPool-1 - Start completed.” (conectado a DB)
  - “Registered gRPC service: com.grupog.UsuarioService”
  - “gRPC Server started … port: 9095”
 - Cliente:
   - Flask running on http://0.0.0.0:5000 (Press CTRL+C to quit)

4) Verificar salud HTTP (opcional si tenés actuator):
```bash
curl http://localhost:8081/actuator/health
# Esperado: {"status":"UP"}
```

5) Probar cliente REST:
```bash
curl http://localhost:5000/health
curl http://localhost:5000/
```

## Insertar datos de prueba (manual)
Entrar a MySQL y crear un usuario de prueba.

1) Conectarse:
```bash
docker compose exec -it db mysql -ugrupog -pgrupog123 bd_empuje_comunitario
```

2) SQL:
```sql
INSERT IGNORE INTO rol (nombre_rol) VALUES ('PRESIDENTE');

INSERT INTO usuarios (
  activo, apellido, contrasenia, email, nombre, nombre_usuario, telefono, rol_id
) VALUES (
  1, 'Perez', 'secret', 'test@example.com', 'Juan', 'juanp', '123456789',
  (SELECT id_rol FROM rol WHERE nombre_rol='PRESIDENTE' LIMIT 1)
);

SELECT id_usuario, nombre, apellido, email FROM usuarios;
```

## Probar gRPC sin cliente (grpcurl)
Como el servidor gRPC registra Server Reflection, podés llamar servicios con `grpcurl`:
```bash
# Instalar grpcurl (según SO) y luego:
grpcurl -plaintext localhost:9095 list
grpcurl -plaintext localhost:9095 com.grupog.UsuarioService/listarUsuarios -d '{}'
```

## Ejecutar cliente fuera de Docker (opcional)
Si preferís correr el cliente localmente, exportá las variables para apuntar al backend publicado en 9095 y ejecutá Flask:
```bash
export GRPC_SERVER_HOST=localhost
export GRPC_SERVER_PORT=9095
python client/app.py
```

## Cambios clave en el backend (resumen)
- Paquete base unificado: `com.grupog`.
- `GrupoGApplication` con:
  - `@SpringBootApplication`
  - `@EntityScan("com.grupog.entities")`
  - `@ComponentScan(basePackages = {"com.grupog"})`
- gRPC:
  - `UsuarioGrpcService extends UsuarioServiceGrpc.UsuarioServiceImplBase`
  - Método `listarUsuarios` consulta `UsuarioRepository` y mapea a proto.
- Puertos:
  - HTTP 8081
  - gRPC 9095 (`GRPC_SERVER_PORT`)

## Troubleshooting
- Puerto ocupado: cambiá los puertos en `compose.yaml` o liberá con `lsof -i :<puerto>`.
- MySQL no aplica `init.sql`: recordá que solo corre con volumen vacío. Usá:
  ```bash
  docker compose down -v && docker compose up --build
  ```
- “Communications link failure”: asegurate de:
  - `depends_on` con healthcheck activo
  - URL JDBC con host `db`
  - Credenciales correctas
- Silenciar aviso JTA (opcional):
  ```
  spring.jpa.properties.hibernate.transaction.jta.platform=org.hibernate.engine.transaction.jta.platform.internal.NoJtaPlatform
  ```

## Comandos útiles
```bash
# Ver logs
docker compose logs -f

# Reiniciar todo
docker compose down && docker compose up --build

# Reset completo (incluye borrar datos DB)
docker compose down -v && docker compose up --build

# Entrar al contenedor MySQL
docker compose exec -it db sh
```



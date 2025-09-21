# Backend Eventos - API Endpoints

## Autenticación

### 1. Login para obtener token
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nombreUsuario": "admin",
    "clave": "dmPeW3oC"
  }'
```

### 2. Extraer token de la respuesta
El token viene en el campo `token` de la respuesta JSON.

## Crear Evento

### Generar timestamp para fecha futura
```bash
TIMESTAMP=$(date -j -f "%Y-%m-%d %H:%M:%S" "2025-12-20 15:30:00" +%s)000
```

### Crear evento
```bash
curl -X POST http://localhost:5000/eventos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d "{
    \"nombreEvento\": \"Evento de Prueba\",
    \"descripcion\": \"Este es un evento de prueba creado via CURL\",
    \"fechaHoraEvento\": $TIMESTAMP
  }"
```

## Obtener Eventos

### Listar todos los eventos
```bash
curl -X GET http://localhost:5000/eventos \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Obtener evento específico
```bash
curl -X GET http://localhost:5000/eventos/ID_DEL_EVENTO \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## Notas
- Los tokens JWT tienen expiración, si falla la autenticación, hacer login nuevamente
- La fecha debe ser un timestamp Unix en milisegundos
- El endpoint base es `http://localhost:5000`
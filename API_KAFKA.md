# API Kafka - Puntos 1 y 2

## 1. Solicitar Donaciones

**POST** `/inventario/solicitar-donaciones`

### Request:
```json
{
  "donaciones": [
    {
      "categoria": "Alimentos",
      "descripcion": "Arroz"
    },
    {
      "categoria": "Higiene",
      "descripcion": "Jabón"
    }
  ]
}
```

### Response:
```json
{
  "idSolicitud": "SOL-1729123456789",
  "mensaje": "Solicitud enviada a la red de ONGs",
  "exito": true
}
```

---

## 2. Listar Solicitudes Externas

**GET** `/inventario/solicitudes-externas?soloActivas=true`

### Response:
```json
{
  "solicitudes": [
    {
      "idSolicitud": "SOL-EXT-001",
      "idOrganizacionSolicitante": 456,
      "donaciones": [
        {
          "categoria": "Alimentos",
          "descripcion": "Arroz",
          "cantidad": 50
        }
      ],
      "activa": true,
      "fechaRecepcion": 1729123456
    }
  ]
}
```

---

## 3. Transferir Donación

**POST** `/inventario/transferir-donacion`

### Request:
```json
{
  "idSolicitud": "SOL-EXT-001",
  "donaciones": [
    {
      "categoria": "Alimentos",
      "descripcion": "Arroz",
      "cantidad": 10
    }
  ]
}
```

### Response:
```json
{
  "mensaje": "Transferencia enviada. Stock descontado correctamente.",
  "exito": true
}
```

---

## Simular ONG Externa (Kafka)

Para testear, envía este JSON al topic `solicitud-donaciones`:

```json
{"idOrganizacionSolicitante":456,"idSolicitud":"SOL-EXT-001","donaciones":[{"categoria":"Alimentos","descripcion":"Arroz"},{"categoria":"Higiene","descripcion":"Jabón"}]}
```


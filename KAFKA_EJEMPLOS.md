# Ejemplos de Mensajes Kafka

Este documento contiene ejemplos de JSON para producir mensajes en cada uno de los topics de Kafka implementados en el sistema.

---

## 📦 Backend de Inventario

### 1. Topic: `solicitud-donaciones`

Solicitud de donaciones que una organización necesita.

```json
{
  "idSolicitud": "SOL-2025-001",
  "idOrganizacionSolicitante": 456,
  "donaciones": [
    {
      "categoria": "Alimentos",
      "descripcion": "Arroz"
    },
    {
      "categoria": "Alimentos",
      "descripcion": "Fideos"
    },
    {
      "categoria": "Higiene",
      "descripcion": "Jabón"
    }
  ]
}
```

---

### 2. Topic: `oferta-donaciones`

Oferta de donaciones que una organización puede proveer.

```json
{
  "idOferta": "OFE-2025-001",
  "idOrganizacionDonante": 123,
  "donacionesOfrecidas": [
    {
      "categoria": "Ropa",
      "descripcion": "Camperas",
      "cantidad": 15
    },
    {
      "categoria": "Ropa",
      "descripcion": "Zapatillas",
      "cantidad": 25
    },
    {
      "categoria": "Alimentos",
      "descripcion": "Leche",
      "cantidad": 100
    }
  ]
}
```

---

### 3. Topic: `transferencia-donaciones`

Transferencia de donaciones de una organización donante a una solicitante.

```json
{
  "idSolicitud": "SOL-2025-001",
  "idOrganizacionDonante": "123",
  "donaciones": [
    {
      "categoria": "Alimentos",
      "descripcion": "Arroz",
      "cantidad": 25
    },
    {
      "categoria": "Alimentos",
      "descripcion": "Fideos",
      "cantidad": 15
    }
  ]
}
```

---

### 4. Topic: `baja-solicitud-donaciones`

Notificación de baja de una solicitud de donación.

```json
{
  "idOrganizacionSolicitante": 456,
  "idSolicitud": "SOL-2025-001"
}
```

---

## 📅 Backend de Eventos

### 5. Topic: `eventos-solidarios`

Publicación de un evento solidario para que otras organizaciones lo vean.

```json
{
  "idOrganizacion": 123,
  "idEvento": "EVT-2025-001",
  "nombreEvento": "Campaña de Invierno 2025",
  "descripcion": "Distribución de ropa y alimentos para familias en situación de vulnerabilidad",
  "fechaHora": "2025-06-15T10:00:00"
}
```

---

### 6. Topic: `baja-evento-solidario`

Notificación de baja de un evento solidario.

```json
{
  "idOrganizacion": 123,
  "idEvento": "EVT-2025-001"
}
```

---

### 7. Topic: `adhesion-evento`

Adhesión de un voluntario a un evento solidario externo.

```json
{
  "idEvento": "EVT-2025-001",
  "voluntario": {
    "idOrganizacion": 456,
    "idVoluntario": 789,
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "+54 11 1234-5678",
    "email": "juan.perez@ejemplo.com"
  }
}
```


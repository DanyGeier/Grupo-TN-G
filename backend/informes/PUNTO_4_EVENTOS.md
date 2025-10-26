# Informe de Participación en Eventos Propios

Implementación del punto 4 usando GraphQL para consultar eventos agrupados por mes.

## Backend

### Query GraphQL
- `informeEventosPropios`: devuelve eventos agrupados por mes
- Filtros: usuario (obligatorio), fechas opcionales, reparto de donaciones opcional
- Validación de roles con JWT: presidente y coordinador ven cualquier usuario, el resto solo sus eventos
- El servicio llama por REST a eventos:8082/eventos/informe

### Archivos modificados
- JwtService.java - valida tokens y extrae rol/usuarioId
- InformeEventosGraphQLController.java - controlador con validación de permisos
- InformeEventoService.java - lógica de consulta y agrupamiento por mes
- schema.graphqls - query y tipos agregados
- pom.xml - dependencias jjwt agregadas

## Frontend

Pantalla con filtros y resultados agrupados por mes.

### Componentes
- InformeEventos.tsx - pantalla principal
- InformeEventos.css - estilos con dark mode
- informeEventosApi.ts - cliente GraphQL
- informeEventos.ts - tipos TypeScript

### Navegación
Agregado en App.tsx ruta /informes/eventos y card en HomePage accesible para todos los roles.

## Probar

Levantar servicios:
```bash
docker compose up -d db mongodb kafka server eventos informes
cd frontend && npm run dev
```

Login, ir a Home, click en "Informe Eventos", seleccionar usuario y filtros, buscar.

## Query GraphQL de ejemplo

```graphql
query InformeEventosPropios($filtro: FiltroEventosInput!) {
  informeEventosPropios(filtro: $filtro) {
    mes
    eventos {
      dia
      nombreEvento
      descripcion
      donaciones
    }
  }
}
```

Variables:
```json
{
  "filtro": {
    "usuarioId": 1,
    "fechaDesde": "2025-01-01T00:00:00",
    "fechaHasta": "2025-12-31T23:59:59",
    "repartoDonaciones": "SI"
  }
}
```

Header: `Authorization: Bearer <token>`

## Notas

- El filtro de usuario es obligatorio
- Presidente y coordinador pueden filtrar por cualquier usuario
- Vocal y voluntario solo ven sus propios eventos (dropdown bloqueado)
- Fechas se convierten automáticamente de ISO a LocalDateTime o epoch millis
- Agrupamiento por mes usando YearMonth ordenado descendente

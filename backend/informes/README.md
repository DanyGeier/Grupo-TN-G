# Microservicio de Informes

Este microservicio expone endpoints GraphQL y REST para generar informes de donaciones.

## Endpoints Implementados

### GraphQL - Informe de Donaciones
**URL:** http://localhost:8084/graphiql

Query para obtener el informe agrupado por categoría:
```graphql
query {
  informeDonaciones {
    donaciones {
      categoria
      eliminado
      totalCantidad
    }
  }
}
```

Con filtros opcionales:
```graphql
query {
  informeDonaciones(
    categoria: "ROPA"
    fechaDesde: "2024-01-01T00:00:00"
    fechaHasta: "2025-12-31T23:59:59"
    eliminado: false
  ) {
    donaciones {
      categoria
      eliminado
      totalCantidad
    }
  }
}
```

### REST - Exportar a Excel
**URL:** http://localhost:8084/api/informes/donaciones/excel

Parámetros query opcionales:
- categoria (String)
- fechaDesde (DateTime: yyyy-MM-dd'T'HH:mm:ss)
- fechaHasta (DateTime: yyyy-MM-dd'T'HH:mm:ss)
- eliminado (Boolean)

Ejemplo:
```
http://localhost:8084/api/informes/donaciones/excel?categoria=ALIMENTOS&eliminado=false
```

El archivo Excel generado contiene una hoja por categoría con el detalle completo de las donaciones.

## Documentación

- **Swagger UI:** http://localhost:8084/swagger-ui.html
- **Health Check:** http://localhost:8084/actuator/health

## Datos de Prueba

El servicio consulta la tabla `inventario_items` de MySQL. Para probar con datos reales, el sistema ya tiene datos cargados de:
- ALIMENTOS
- JUGUETES
- ROPA
- UTILES_ESCOLARES

## Tecnologías

- Spring Boot 3.5.5
- GraphQL (spring-boot-starter-graphql)
- Apache POI (generación de Excel)
- Spring Data JPA
- MySQL

## Puerto

8084

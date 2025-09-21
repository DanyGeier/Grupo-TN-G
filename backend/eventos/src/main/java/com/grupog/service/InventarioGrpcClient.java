package com.grupog.service;

import org.springframework.stereotype.Service;

@Service
public class InventarioGrpcClient {

    // TODO: Implementar cuando se resuelvan las dependencias gRPC
    // @GrpcClient("inventario-service")
    // private InventarioServiceBlockingStub inventarioStub;

    public void descontarDonacion(String categoria, String descripcion, int cantidad) {
        // TODO: Implementar llamada real al servicio de inventario
        // DescontarDonacionRequest request = DescontarDonacionRequest.newBuilder()
        // .setCategoria(categoria)
        // .setDescripcion(descripcion)
        // .setCantidad(cantidad)
        // .build();
        // inventarioStub.descontarDonacion(request);

        // Simulación temporal - solo log
        System.out.println("Simulando descuento de inventario:");
        System.out.println("  Categoría: " + categoria);
        System.out.println("  Descripción: " + descripcion);
        System.out.println("  Cantidad: " + cantidad);
    }

    public int consultarStock(String categoria) {
        // TODO: Implementar llamada real al servicio de inventario
        // ConsultarStockRequest request = ConsultarStockRequest.newBuilder()
        // .setCategoria(categoria)
        // .build();
        // ConsultarStockResponse response = inventarioStub.consultarStock(request);
        // return response.getCantidad();

        // Simulación temporal
        System.out.println("Simulando consulta de stock para categoría: " + categoria);
        return 100; // Stock simulado
    }

    public boolean verificarDisponibilidad(String categoria, int cantidad) {
        // TODO: Implementar llamada real al servicio de inventario
        // int stock = consultarStock(categoria);
        // return stock >= cantidad;

        // Simulación temporal
        int stockSimulado = consultarStock(categoria);
        boolean disponible = stockSimulado >= cantidad;
        System.out.println("Verificando disponibilidad: " + cantidad + " de " + categoria +
                " (Stock: " + stockSimulado + ", Disponible: " + disponible + ")");
        return disponible;
    }
}

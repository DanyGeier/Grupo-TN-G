package com.grupog.service;

import com.grupog.inventario.CategoriaInventario;
import com.grupog.inventario.InventarioServiceGrpc;
import com.grupog.inventario.ListarItemsRequest;
import com.grupog.inventario.RegistrarSalidaRequest;
import com.grupog.inventario.ListaItemsResponse;
import io.grpc.StatusRuntimeException;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
public class InventarioGrpcClient {

    @GrpcClient("inventario-service")
    private InventarioServiceGrpc.InventarioServiceBlockingStub inventarioStub;

    public void descontarDonacion(String categoria, String descripcion, int cantidad, long usuarioId) {
        RegistrarSalidaRequest req = RegistrarSalidaRequest.newBuilder()
                .setCategoria(parseCategoria(categoria))
                .setDescripcion(descripcion)
                .setCantidad(cantidad)
                .setUsuarioEjecutor(String.valueOf(usuarioId))
                .build();
        inventarioStub.registrarSalida(req);
    }

    public int consultarStock(String categoria) {
        ListaItemsResponse resp = inventarioStub.listarItems(ListarItemsRequest.newBuilder().setIncluirEliminados(false).build());
        return resp.getItemsList().stream()
                .filter(i -> i.getCategoria().name().equalsIgnoreCase(categoria))
                .mapToInt(i -> i.getCantidad())
                .sum();
    }

    public boolean verificarDisponibilidad(String categoria, int cantidad) {
        try {
            int stock = consultarStock(categoria);
            return stock >= cantidad;
        } catch (StatusRuntimeException e) {
            return false;
        }
    }

    private CategoriaInventario parseCategoria(String c) {
        try { return CategoriaInventario.valueOf(c); } catch (Exception e) { return CategoriaInventario.ROPA; }
    }
}

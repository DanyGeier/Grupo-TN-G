package com.grupog.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupog.entities.ItemInventarioEntity;
import com.grupog.events.OfertaDonacionEvent.DetalleOfertaDonacion;
import com.grupog.events.SolicitudDonacionEvent;
import com.grupog.repositories.ItemInventarioRepository;

@Service
public class ItemInventarioService {

    @Autowired
    private ItemInventarioRepository itemInventarioRepository;

    private static final Logger logger = LoggerFactory.getLogger(ItemInventarioService.class);

    /**
     * DESCONTAR del inventario (cuando ENVIAMOS donación)
     * Retorna true si todo OK, false si no hay stock suficiente
     */
    public boolean descontarStock(List<SolicitudDonacionEvent.DonacionItem> donaciones) {
        for (SolicitudDonacionEvent.DonacionItem item : donaciones) {
            // Buscar el item en nuestro inventario
            Optional<ItemInventarioEntity> optItem = itemInventarioRepository
                    .findFirstByCategoriaAndDescripcionAndEliminadoFalse(
                            item.getCategoria(),
                            item.getDescripcion());

            if (optItem.isEmpty()) {
                logger.error("Item no encontrado: {}", item.getDescripcion());
                return false;
            }

            ItemInventarioEntity inventarioItem = optItem.get();

            // Verificar stock suficiente
            if (inventarioItem.getCantidad() < item.getCantidad()) {
                logger.error("Stock insuficiente: {} (tenemos: {}, necesitamos: {})",
                        item.getDescripcion(), inventarioItem.getCantidad(), item.getCantidad());
                return false;
            }

            // Descontar
            inventarioItem.setCantidad(inventarioItem.getCantidad() - item.getCantidad());
            itemInventarioRepository.save(inventarioItem);

            logger.info("Descontado: {} - Cantidad: {}", item.getDescripcion(), item.getCantidad());
        }

        return true;
    }

    public void sumarStock(List<SolicitudDonacionEvent.DonacionItem> donaciones) {
        for (SolicitudDonacionEvent.DonacionItem item : donaciones) {
            // Buscar si ya existe
            Optional<ItemInventarioEntity> optItem = itemInventarioRepository
                    .findFirstByCategoriaAndDescripcionAndEliminadoFalse(
                            item.getCategoria(),
                            item.getDescripcion());

            if (optItem.isPresent()) {
                // Ya existe, sumar cantidad
                ItemInventarioEntity inventarioItem = optItem.get();
                inventarioItem.setCantidad(inventarioItem.getCantidad() + item.getCantidad());
                itemInventarioRepository.save(inventarioItem);
                logger.info("Sumado a item existente: {} (+{})",
                        item.getDescripcion(), item.getCantidad());
            } else {
                // No existe, crear nuevo
                ItemInventarioEntity nuevoItem = new ItemInventarioEntity();
                nuevoItem.setCategoria(item.getCategoria());
                nuevoItem.setDescripcion(item.getDescripcion());
                nuevoItem.setCantidad(item.getCantidad());
                nuevoItem.setEliminado(false);
                itemInventarioRepository.save(nuevoItem);
                logger.info("Nuevo item creado: {} ({})",
                        item.getDescripcion(), item.getCantidad());
            }
        }
    }
}

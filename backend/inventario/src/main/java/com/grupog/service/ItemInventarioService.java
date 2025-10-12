package com.grupog.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupog.entities.ItemInventarioEntity;
import com.grupog.events.OfertaDonacionEvent.DetalleOfertaDonacion;
import com.grupog.repositories.ItemInventarioRepository;

@Service
public class ItemInventarioService {
    
    @Autowired
    private ItemInventarioRepository itemInventarioRepository;

    public void descontarStock(List<DetalleOfertaDonacion> donacionesOfrecidas) {
        for (DetalleOfertaDonacion detalle : donacionesOfrecidas) {
            Optional<ItemInventarioEntity> optionalItem = itemInventarioRepository.findByDescripcion(detalle.getDescripcion());
            if (optionalItem.isPresent()) {
                ItemInventarioEntity item = optionalItem.get();
                int nuevaCantidad = item.getCantidad() - detalle.getCantidad();
                item.setCantidad(nuevaCantidad);
                itemInventarioRepository.save(item);
                System.out.println("Stock de " + item.getDescripcion() + " actualizado a " + nuevaCantidad);
            } else {
                System.out.println("No se encontro el item solicitado");
            }
        }
    }
}

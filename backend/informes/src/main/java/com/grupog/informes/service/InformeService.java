package com.grupog.informes.service;

import com.grupog.informes.model.DonacionAgrupada;
import com.grupog.informes.model.InventarioItem;
import com.grupog.informes.repository.InventarioItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InformeService {

    @Autowired
    private InventarioItemRepository inventarioItemRepository;

    // Obtener informe agrupado (punto 1)
    public List<DonacionAgrupada> obtenerInformeAgrupado(
            String categoria,
            LocalDateTime fechaDesde,
            LocalDateTime fechaHasta,
            Boolean eliminado) {

        List<Object[]> resultados = inventarioItemRepository.obtenerInformeAgrupado(
            categoria, fechaDesde, fechaHasta, eliminado
        );

        return resultados.stream()
            .map(row -> new DonacionAgrupada(
                (String) row[0],      // categoria
                (Boolean) row[1],     // eliminado
                ((Number) row[2]).longValue()  // totalCantidad
            ))
            .collect(Collectors.toList());
    }

    // Obtener detalle para Excel (punto 3)
    public List<InventarioItem> obtenerDetalleParaExcel(
            String categoria,
            LocalDateTime fechaDesde,
            LocalDateTime fechaHasta,
            Boolean eliminado) {

        return inventarioItemRepository.obtenerDetalleParaExcel(
            categoria, fechaDesde, fechaHasta, eliminado
        );
    }
}


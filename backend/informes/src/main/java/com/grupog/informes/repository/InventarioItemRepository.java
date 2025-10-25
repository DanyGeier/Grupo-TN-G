package com.grupog.informes.repository;

import com.grupog.informes.model.InventarioItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventarioItemRepository extends JpaRepository<InventarioItem, Long> {

    // Query para el informe agrupado (punto 1 - GraphQL)
    @Query("""
        SELECT i.categoria as categoria, i.eliminado as eliminado, SUM(i.cantidad) as totalCantidad
        FROM InventarioItem i
        WHERE (:categoria IS NULL OR i.categoria = :categoria)
        AND (:fechaDesde IS NULL OR i.fechaAlta >= :fechaDesde)
        AND (:fechaHasta IS NULL OR i.fechaAlta <= :fechaHasta)
        AND (:eliminado IS NULL OR i.eliminado = :eliminado)
        GROUP BY i.categoria, i.eliminado
        ORDER BY i.categoria, i.eliminado
    """)
    List<Object[]> obtenerInformeAgrupado(
        @Param("categoria") String categoria,
        @Param("fechaDesde") LocalDateTime fechaDesde,
        @Param("fechaHasta") LocalDateTime fechaHasta,
        @Param("eliminado") Boolean eliminado
    );

    // Query para el detalle de donaciones (punto 3 - Excel)
    @Query("""
        SELECT i FROM InventarioItem i
        WHERE (:categoria IS NULL OR i.categoria = :categoria)
        AND (:fechaDesde IS NULL OR i.fechaAlta >= :fechaDesde)
        AND (:fechaHasta IS NULL OR i.fechaAlta <= :fechaHasta)
        AND (:eliminado IS NULL OR i.eliminado = :eliminado)
        ORDER BY i.categoria, i.fechaAlta
    """)
    List<InventarioItem> obtenerDetalleParaExcel(
        @Param("categoria") String categoria,
        @Param("fechaDesde") LocalDateTime fechaDesde,
        @Param("fechaHasta") LocalDateTime fechaHasta,
        @Param("eliminado") Boolean eliminado
    );
}


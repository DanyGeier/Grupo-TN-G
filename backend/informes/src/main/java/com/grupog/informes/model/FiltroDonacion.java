package com.grupog.informes.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "filtros_donaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FiltroDonacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_filtro", nullable = false, length = 100)
    private String nombreFiltro;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "categoria", length = 50)
    private String categoria;

    @Column(name = "fecha_desde")
    private LocalDateTime fechaDesde;

    @Column(name = "fecha_hasta")
    private LocalDateTime fechaHasta;

    @Column(name = "eliminado")
    private Boolean eliminado;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    // Constructor para crear filtro con fecha actual
    public FiltroDonacion(String nombreFiltro, Long usuarioId, String categoria,
            LocalDateTime fechaDesde, LocalDateTime fechaHasta, Boolean eliminado) {
        this.nombreFiltro = nombreFiltro;
        this.usuarioId = usuarioId;
        this.categoria = categoria;
        this.fechaDesde = fechaDesde;
        this.fechaHasta = fechaHasta;
        this.eliminado = eliminado;
        this.fechaCreacion = LocalDateTime.now();
    }
}

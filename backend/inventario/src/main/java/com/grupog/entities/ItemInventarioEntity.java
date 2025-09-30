package com.grupog.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "inventario_items")
public class ItemInventarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String categoria; // ROPA, ALIMENTOS, etc.

    private String descripcion;

    @Column(nullable = false)
    private int cantidad;

    @Column(nullable = false)
    private boolean eliminado = false;

    @Column(nullable = false)
    private Instant fechaAlta = Instant.now();

    private String usuarioAlta;

    private Instant fechaModificacion;

    private String usuarioModificacion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public boolean isEliminado() { return eliminado; }
    public void setEliminado(boolean eliminado) { this.eliminado = eliminado; }

    public Instant getFechaAlta() { return fechaAlta; }
    public void setFechaAlta(Instant fechaAlta) { this.fechaAlta = fechaAlta; }

    public String getUsuarioAlta() { return usuarioAlta; }
    public void setUsuarioAlta(String usuarioAlta) { this.usuarioAlta = usuarioAlta; }

    public Instant getFechaModificacion() { return fechaModificacion; }
    public void setFechaModificacion(Instant fechaModificacion) { this.fechaModificacion = fechaModificacion; }

    public String getUsuarioModificacion() { return usuarioModificacion; }
    public void setUsuarioModificacion(String usuarioModificacion) { this.usuarioModificacion = usuarioModificacion; }
}

package com.grupog.entities;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;

@Embeddable
public class ItemDonacionEntity {

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "descripcion")
    private String descripcion;

    // Constructores
    public ItemDonacionEntity() {
    }

    public ItemDonacionEntity(String categoria, String descripcion) {
        this.categoria = categoria;
        this.descripcion = descripcion;
    }

    // Getters y Setters
    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

}
package com.grupog.informes.model;

import java.time.LocalDateTime;

public class Evento {
    private String id;
    private String nombreEvento;
    private String descripcion;
    private LocalDateTime fechaHoraEvento;
    private boolean tieneDonacionesRepartidas;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombreEvento() {
        return nombreEvento;
    }

    public void setNombreEvento(String nombreEvento) {
        this.nombreEvento = nombreEvento;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaHoraEvento() {
        return fechaHoraEvento;
    }

    public void setFechaHoraEvento(LocalDateTime fechaHoraEvento) {
        this.fechaHoraEvento = fechaHoraEvento;
    }

    public boolean isTieneDonacionesRepartidas() {
        return tieneDonacionesRepartidas;
    }

    public void setTieneDonacionesRepartidas(boolean tieneDonacionesRepartidas) {
        this.tieneDonacionesRepartidas = tieneDonacionesRepartidas;
    }
}

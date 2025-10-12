package com.grupog.events;

import java.time.LocalDateTime;

public class EventoSolidarioEvent {

    private Long idOrganizacion;
    private String idEvento;
    private String nombreEvento;
    private String descripcion;
    private LocalDateTime fechaHora;

    public EventoSolidarioEvent() {
    }

    public EventoSolidarioEvent(Long idOrganizacion, String idEvento, String nombreEvento,
            String descripcion, LocalDateTime fechaHora) {
        this.idOrganizacion = idOrganizacion;
        this.idEvento = idEvento;
        this.nombreEvento = nombreEvento;
        this.descripcion = descripcion;
        this.fechaHora = fechaHora;
    }

    public Long getIdOrganizacion() {
        return idOrganizacion;
    }

    public void setIdOrganizacion(Long idOrganizacion) {
        this.idOrganizacion = idOrganizacion;
    }

    public String getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(String idEvento) {
        this.idEvento = idEvento;
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

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    @Override
    public String toString() {
        return "EventoSolidarioEvent{" +
                "idOrganizacion=" + idOrganizacion +
                ", idEvento='" + idEvento + '\'' +
                ", nombreEvento='" + nombreEvento + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", fechaHora=" + fechaHora +
                '}';
    }
}

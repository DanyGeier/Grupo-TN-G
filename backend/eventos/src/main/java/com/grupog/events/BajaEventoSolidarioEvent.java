package com.grupog.events;

public class BajaEventoSolidarioEvent {

    private Long idOrganizacion;
    private String idEvento;

    public BajaEventoSolidarioEvent() {
    }

    public BajaEventoSolidarioEvent(Long idOrganizacion, String idEvento) {
        this.idOrganizacion = idOrganizacion;
        this.idEvento = idEvento;
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

    @Override
    public String toString() {
        return "BajaEventoSolidarioEvent{" +
                "idOrganizacion=" + idOrganizacion +
                ", idEvento='" + idEvento + '\'' +
                '}';
    }
}


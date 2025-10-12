package com.grupog.events;

public class BajaSolicitudDonacionEvent {

    private Long idOrganizacionSolicitante;
    private String idSolicitud;

    public BajaSolicitudDonacionEvent() {
    }

    public BajaSolicitudDonacionEvent(Long idOrganizacionSolicitante, String idSolicitud) {
        this.idOrganizacionSolicitante = idOrganizacionSolicitante;
        this.idSolicitud = idSolicitud;
    }

    public Long getIdOrganizacionSolicitante() {
        return idOrganizacionSolicitante;
    }

    public void setIdOrganizacionSolicitante(Long idOrganizacionSolicitante) {
        this.idOrganizacionSolicitante = idOrganizacionSolicitante;
    }

    public String getIdSolicitud() {
        return idSolicitud;
    }

    public void setIdSolicitud(String idSolicitud) {
        this.idSolicitud = idSolicitud;
    }

    @Override
    public String toString() {
        return "BajaSolicitudDonacionEvent{" +
                "idOrganizacionSolicitante=" + idOrganizacionSolicitante +
                ", idSolicitud='" + idSolicitud + '\'' +
                '}';
    }
}

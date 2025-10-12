package com.grupog.events;

import java.util.List;

import com.grupog.events.SolicitudDonacionEvent.DonacionItem;

public class TransferirDonacionEvent {

    private String idSolicitud;
    private String idOrganizacionDonante;
    private List<DonacionItem> donaciones;

    public TransferirDonacionEvent() {
    }

    public String getIdSolicitud() {
        return idSolicitud;
    }

    public void setIdSolicitud(String idSolicitud) {
        this.idSolicitud = idSolicitud;
    }

    public String getIdOrganizacionDonante() {
        return idOrganizacionDonante;
    }

    public void setIdOrganizacionDonante(String idOrganizacionDonante) {
        this.idOrganizacionDonante = idOrganizacionDonante;
    }

    public List<DonacionItem> getDonaciones() {
        return donaciones;
    }

    public void setDonaciones(List<DonacionItem> donaciones) {
        this.donaciones = donaciones;
    }

    @Override
    public String toString() {
        return "TransferirDonacionEvent{" +
                "idSolicitud='" + idSolicitud + '\'' +
                ", idOrganizacionDonante='" + idOrganizacionDonante + '\'' +
                ", donaciones=" + donaciones +
                '}';
    }
}

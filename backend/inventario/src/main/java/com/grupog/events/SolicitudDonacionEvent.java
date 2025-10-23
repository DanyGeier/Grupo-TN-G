package com.grupog.events;

import java.util.List;

public class SolicitudDonacionEvent {

    private Long idOrganizacionSolicitante;
    private String idSolicitud;
    private List<DonacionItem> donaciones;

    public SolicitudDonacionEvent() {
    }

    // Getters y Setters
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

    public List<DonacionItem> getDonaciones() {
        return donaciones;
    }

    public void setDonaciones(List<DonacionItem> donaciones) {
        this.donaciones = donaciones;
    }

    @Override
    public String toString() {
        return "SolicitudDonacionEvent{" +
                "idOrganizacionSolicitante=" + idOrganizacionSolicitante +
                ", idSolicitud='" + idSolicitud + '\'' +
                ", donaciones=" + donaciones +
                '}';
    }

    // Clase interna para el item de donación
    public static class DonacionItem {
        private String categoria;
        private String descripcion;
        private int cantidad;

        public DonacionItem() {
        }

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

        public int getCantidad() {
            return cantidad;
        }

        public void setCantidad(int cantidad) {
            this.cantidad = cantidad;
        }

        @Override
        public String toString() {
            return "DonacionItem{" +
                    "categoria='" + categoria + '\'' +
                    ", descripcion='" + descripcion + '\'' +
                    '}';
        }
    }
}

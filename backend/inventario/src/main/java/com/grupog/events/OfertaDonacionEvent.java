package com.grupog.events;

import java.util.List;

public class OfertaDonacionEvent {

    private String idOferta;
    private Long idOrganizacionDonante;
    private List<DetalleOfertaDonacion> donacionesOfrecidas;
    
    public OfertaDonacionEvent() {
    }

    public String getIdOferta() {
        return idOferta;
    }

    public void setIdOferta(String idOferta) {
        this.idOferta = idOferta;
    }

    public Long getIdOrganizacionDonante() {
        return idOrganizacionDonante;
    }

    public void setIdOrganizacionDonante(Long idOrganizacionDonante) {
        this.idOrganizacionDonante = idOrganizacionDonante;
    }

    public List<DetalleOfertaDonacion> getDonacionesOfrecidas() {
        return donacionesOfrecidas;
    }

    public void setDonacionesOfrecidas(List<DetalleOfertaDonacion> donacionesOfrecidas) {
        this.donacionesOfrecidas = donacionesOfrecidas;
    }

    @Override
    public String toString() {
        return "OfertaDonacionEvent{" +
                "idOferta= '" + idOferta + '\'' +
                ", idOrganizacionDonante=" + idOrganizacionDonante +
                ", donacionesOfrecidas=" + donacionesOfrecidas +
                '}';
    }

    //Clase interna para el item de donacion
    public static class DetalleOfertaDonacion {

        private String categoria;
        private String descripcion;
        private int cantidad;

        public DetalleOfertaDonacion() {
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
            return "DetalleOfertaDonacion{" +
                    "categoria='" + categoria + '\'' +
                    ", descripcion='" + descripcion + '\'' +
                    ", cantidad=" + cantidad + 
                    '}';
        }
    }
}
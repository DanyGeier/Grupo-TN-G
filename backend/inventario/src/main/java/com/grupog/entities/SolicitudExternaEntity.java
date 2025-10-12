package com.grupog.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.JoinColumn;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitudes_externas")
public class SolicitudExternaEntity {

    @Id
    @Column(name = "id_solicitud", nullable = false)
    private String idSolicitud;

    @Column(name = "id_organizacion_solicitante", nullable = false)
    private Long idOrganizacionSolicitante;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "donaciones_solicitadas", joinColumns = @JoinColumn(name = "id_solicitud") // FK
    )
    private List<ItemDonacionEntity> donaciones = new ArrayList<>();

    @Column(name = "activa", nullable = false)
    private Boolean activa = true;

    @Column(name = "fecha_recepcion")
    private LocalDateTime fechaRecepcion;

    // Constructores
    public SolicitudExternaEntity() {
    }

    public SolicitudExternaEntity(String idSolicitud, Long idOrganizacionSolicitante,
            List<ItemDonacionEntity> donaciones) {
        this.idSolicitud = idSolicitud;
        this.idOrganizacionSolicitante = idOrganizacionSolicitante;
        this.donaciones = donaciones;
        this.activa = true;
        this.fechaRecepcion = LocalDateTime.now();
    }

    public String getIdSolicitud() {
        return idSolicitud;
    }

    public void setIdSolicitud(String idSolicitud) {
        this.idSolicitud = idSolicitud;
    }

    public Long getIdOrganizacionSolicitante() {
        return idOrganizacionSolicitante;
    }

    public void setIdOrganizacionSolicitante(Long idOrganizacionSolicitante) {
        this.idOrganizacionSolicitante = idOrganizacionSolicitante;
    }

    public Boolean getActiva() {
        return activa;
    }

    public List<ItemDonacionEntity> getDonaciones() {
        return donaciones;
    }

    public void setDonaciones(List<ItemDonacionEntity> donaciones) {
        this.donaciones = donaciones;
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
    }

    public LocalDateTime getFechaRecepcion() {
        return fechaRecepcion;
    }

    public void setFechaRecepcion(LocalDateTime fechaRecepcion) {
        this.fechaRecepcion = fechaRecepcion;
    }

}

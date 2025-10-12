package com.grupog.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "solicitudes_canceladas")
public class SolicitudCanceladaEntity { 

    @Id    
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_solicitud_kafka", nullable = false, unique = true)
    private String idSolicitudKafka;

    public SolicitudCanceladaEntity(String idSolicitudKafka) {
        this.idSolicitudKafka = idSolicitudKafka;   
    }
}
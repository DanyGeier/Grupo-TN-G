package com.grupog.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "ofertas_externas")
public class OfertaExternaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_oferta_kafka", nullable = false, unique = true)
    private String idOfertaKafka;

    @Column(name = "id_organizacion_donante", nullable = false)
    private Long idOrganizacionDonante;

    @Column(columnDefinition = "TEXT")
    private String detalleDonaciones;

    public OfertaExternaEntity() {
    }

    public OfertaExternaEntity(String idOfertaKafka, Long idOrganizacionDonante, String detalleDonaciones) {
        this.idOfertaKafka = idOfertaKafka;
        this.idOrganizacionDonante = idOrganizacionDonante;
        this.detalleDonaciones = detalleDonaciones;
    }
}

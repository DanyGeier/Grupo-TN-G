package com.grupog.documents;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "eventos")
public class EventoDocument {

    @Id
    private String id;

    @Field("nombre_evento")
    @Indexed
    private String nombreEvento;

    @Field("descripcion")
    private String descripcion;

    @Field("fecha_hora_evento")
    @Indexed
    private LocalDateTime fechaHoraEvento;

    @Field("participantes_ids")
    private List<Long> participantesIds = new ArrayList<>();

    @Field("donaciones_repartidas")
    private List<DonacionRepartidaSimple> donacionesRepartidas = new ArrayList<>();

    @Field("fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Field("usuario_creacion")
    private Long usuarioCreacion;

    @Field("activo")
    @Indexed
    private Boolean activo = true;

    // Clase interna para donaciones repartidas
    public static class DonacionRepartidaSimple {
        @Field("categoria")
        private String categoria;

        @Field("descripcion")
        private String descripcion;

        @Field("cantidad_repartida")
        private Integer cantidadRepartida;

        @Field("fecha_repartida")
        private LocalDateTime fechaRepartida;

        @Field("usuario_repartida_id")
        private Long usuarioRepartidaId;

        @Field("nombre_usuario_repartida")
        private String nombreUsuarioRepartida;

        // Constructors
        public DonacionRepartidaSimple() {
        }

        public DonacionRepartidaSimple(String categoria, String descripcion, Integer cantidadRepartida,
                LocalDateTime fechaRepartida, Long usuarioRepartidaId, String nombreUsuarioRepartida) {
            this.categoria = categoria;
            this.descripcion = descripcion;
            this.cantidadRepartida = cantidadRepartida;
            this.fechaRepartida = fechaRepartida;
            this.usuarioRepartidaId = usuarioRepartidaId;
            this.nombreUsuarioRepartida = nombreUsuarioRepartida;
        }

        // Getters and Setters
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

        public Integer getCantidadRepartida() {
            return cantidadRepartida;
        }

        public void setCantidadRepartida(Integer cantidadRepartida) {
            this.cantidadRepartida = cantidadRepartida;
        }

        public LocalDateTime getFechaRepartida() {
            return fechaRepartida;
        }

        public void setFechaRepartida(LocalDateTime fechaRepartida) {
            this.fechaRepartida = fechaRepartida;
        }

        public Long getUsuarioRepartidaId() {
            return usuarioRepartidaId;
        }

        public void setUsuarioRepartidaId(Long usuarioRepartidaId) {
            this.usuarioRepartidaId = usuarioRepartidaId;
        }

        public String getNombreUsuarioRepartida() {
            return nombreUsuarioRepartida;
        }

        public void setNombreUsuarioRepartida(String nombreUsuarioRepartida) {
            this.nombreUsuarioRepartida = nombreUsuarioRepartida;
        }
    }

    // Constructors
    public EventoDocument() {
    }

    public EventoDocument(String nombreEvento, String descripcion, LocalDateTime fechaHoraEvento,
            Long usuarioCreacion) {
        this.nombreEvento = nombreEvento;
        this.descripcion = descripcion;
        this.fechaHoraEvento = fechaHoraEvento;
        this.usuarioCreacion = usuarioCreacion;
        this.fechaCreacion = LocalDateTime.now();
        this.activo = true;
        this.participantesIds = new ArrayList<>();
        this.donacionesRepartidas = new ArrayList<>();
    }

    // Getters and Setters
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

    public List<Long> getParticipantesIds() {
        return participantesIds;
    }

    public void setParticipantesIds(List<Long> participantesIds) {
        this.participantesIds = participantesIds;
    }

    public List<DonacionRepartidaSimple> getDonacionesRepartidas() {
        return donacionesRepartidas;
    }

    public void setDonacionesRepartidas(List<DonacionRepartidaSimple> donacionesRepartidas) {
        this.donacionesRepartidas = donacionesRepartidas;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Long getUsuarioCreacion() {
        return usuarioCreacion;
    }

    public void setUsuarioCreacion(Long usuarioCreacion) {
        this.usuarioCreacion = usuarioCreacion;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}

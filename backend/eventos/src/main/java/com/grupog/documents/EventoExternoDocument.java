package com.grupog.documents;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "eventos_externos")
@CompoundIndexes({
        @CompoundIndex(name = "org_evento_idx", def = "{ 'id_organizacion': 1, 'id_evento': 1 }", unique = true)
})
public class EventoExternoDocument {

    @Id
    private String id;

    @Field("id_organizacion")
    @Indexed
    private Long idOrganizacion;

    @Field("id_evento")
    @Indexed
    private String idEvento;

    @Field("nombre_evento")
    private String nombreEvento;

    @Field("descripcion")
    private String descripcion;

    @Field("fecha_hora")
    @Indexed
    private LocalDateTime fechaHora;

    @Field("activo")
    @Indexed
    private Boolean activo = true;

    @Field("fecha_recepcion")
    private LocalDateTime fechaRecepcion = LocalDateTime.now();

    public EventoExternoDocument() {}

    public EventoExternoDocument(Long idOrganizacion, String idEvento, String nombreEvento, String descripcion, LocalDateTime fechaHora) {
        this.idOrganizacion = idOrganizacion;
        this.idEvento = idEvento;
        this.nombreEvento = nombreEvento;
        this.descripcion = descripcion;
        this.fechaHora = fechaHora;
        this.activo = true;
        this.fechaRecepcion = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getIdOrganizacion() { return idOrganizacion; }
    public void setIdOrganizacion(Long idOrganizacion) { this.idOrganizacion = idOrganizacion; }

    public String getIdEvento() { return idEvento; }
    public void setIdEvento(String idEvento) { this.idEvento = idEvento; }

    public String getNombreEvento() { return nombreEvento; }
    public void setNombreEvento(String nombreEvento) { this.nombreEvento = nombreEvento; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public LocalDateTime getFechaRecepcion() { return fechaRecepcion; }
    public void setFechaRecepcion(LocalDateTime fechaRecepcion) { this.fechaRecepcion = fechaRecepcion; }
}


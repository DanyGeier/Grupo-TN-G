package com.grupog.documents;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "adhesiones_eventos")
public class AdhesionEventoDocument {

    @Id
    private String id;

    @Field("id_evento")
    private String idEvento;

    @Field("id_organizacion_voluntario")
    private Long idOrganizacionVoluntario;

    @Field("id_voluntario")
    private Long idVoluntario;

    @Field("nombre")
    private String nombre;

    @Field("apellido")
    private String apellido;

    @Field("telefono")
    private String telefono;

    @Field("email")
    private String email;

    @Field("fecha_adhesion")
    private LocalDateTime fechaAdhesion;

    public AdhesionEventoDocument() {
    }

    public AdhesionEventoDocument(String idEvento, Long idOrganizacionVoluntario, Long idVoluntario,
                                   String nombre, String apellido, String telefono, String email) {
        this.idEvento = idEvento;
        this.idOrganizacionVoluntario = idOrganizacionVoluntario;
        this.idVoluntario = idVoluntario;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
        this.fechaAdhesion = LocalDateTime.now();
    }

    // Getters y Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(String idEvento) {
        this.idEvento = idEvento;
    }

    public Long getIdOrganizacionVoluntario() {
        return idOrganizacionVoluntario;
    }

    public void setIdOrganizacionVoluntario(Long idOrganizacionVoluntario) {
        this.idOrganizacionVoluntario = idOrganizacionVoluntario;
    }

    public Long getIdVoluntario() {
        return idVoluntario;
    }

    public void setIdVoluntario(Long idVoluntario) {
        this.idVoluntario = idVoluntario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getFechaAdhesion() {
        return fechaAdhesion;
    }

    public void setFechaAdhesion(LocalDateTime fechaAdhesion) {
        this.fechaAdhesion = fechaAdhesion;
    }
}


package com.grupog.events;

public class AdhesionEventoEvent {

    private String idEvento;
    private Voluntario voluntario;

    public AdhesionEventoEvent() {
    }

    public AdhesionEventoEvent(String idEvento, Voluntario voluntario) {
        this.idEvento = idEvento;
        this.voluntario = voluntario;
    }

    public String getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(String idEvento) {
        this.idEvento = idEvento;
    }

    public Voluntario getVoluntario() {
        return voluntario;
    }

    public void setVoluntario(Voluntario voluntario) {
        this.voluntario = voluntario;
    }

    @Override
    public String toString() {
        return "AdhesionEventoEvent{" +
                "idEvento='" + idEvento + '\'' +
                ", voluntario=" + voluntario +
                '}';
    }

    // Clase interna para los datos del Voluntario
    public static class Voluntario {

        private Long idOrganizacion;
        private Long idVoluntario;
        private String nombre;
        private String apellido;
        private String telefono;
        private String email;

        public Voluntario() {
        }

        public Voluntario(Long idOrganizacion, Long idVoluntario, String nombre, String apellido,
                String telefono, String email) {
            this.idOrganizacion = idOrganizacion;
            this.idVoluntario = idVoluntario;
            this.nombre = nombre;
            this.apellido = apellido;
            this.telefono = telefono;
            this.email = email;
        }

        public Long getIdOrganizacion() {
            return idOrganizacion;
        }

        public void setIdOrganizacion(Long idOrganizacion) {
            this.idOrganizacion = idOrganizacion;
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

        @Override
        public String toString() {
            return "Voluntario{" +
                    "idOrganizacion=" + idOrganizacion +
                    ", idVoluntario=" + idVoluntario +
                    ", nombre='" + nombre + '\'' +
                    ", apellido='" + apellido + '\'' +
                    ", telefono='" + telefono + '\'' +
                    ", email='" + email + '\'' +
                    '}';
        }
    }
}

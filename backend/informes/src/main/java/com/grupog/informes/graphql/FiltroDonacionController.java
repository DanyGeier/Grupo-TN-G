package com.grupog.informes.graphql;

import com.grupog.informes.model.FiltroDonacion;
import com.grupog.informes.service.FiltroDonacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class FiltroDonacionController {

    @Autowired
    private FiltroDonacionService filtroDonacionService;

    @QueryMapping
    public List<FiltroDonacionGraphQL> listarFiltrosDonacion(@Argument Long usuarioId) {
        List<FiltroDonacion> filtros = filtroDonacionService.listarFiltrosPorUsuario(usuarioId);
        return filtros.stream()
                .map(this::convertirAGraphQL)
                .collect(Collectors.toList());
    }

    private FiltroDonacionGraphQL convertirAGraphQL(FiltroDonacion filtro) {
        FiltroDonacionGraphQL result = new FiltroDonacionGraphQL();
        result.setId(filtro.getId().toString());
        result.setNombreFiltro(filtro.getNombreFiltro());
        result.setUsuarioId(filtro.getUsuarioId().toString());
        result.setCategoria(filtro.getCategoria());
        result.setFechaDesde(filtro.getFechaDesde());
        result.setFechaHasta(filtro.getFechaHasta());
        result.setEliminado(filtro.getEliminado());
        result.setFechaCreacion(filtro.getFechaCreacion());
        return result;
    }

    @MutationMapping
    public FiltroDonacionGraphQL guardarFiltroDonacion(@Argument FiltroDonacionInput input) {
        FiltroDonacion filtro = new FiltroDonacion(
                input.getNombreFiltro(),
                input.getUsuarioId(),
                input.getCategoria(),
                input.getFechaDesde(),
                input.getFechaHasta(),
                input.getEliminado());
        FiltroDonacion guardado = filtroDonacionService.guardarFiltro(filtro);
        return convertirAGraphQL(guardado);
    }

    @MutationMapping
    public FiltroDonacionGraphQL actualizarFiltroDonacion(
            @Argument Long id,
            @Argument FiltroDonacionInput input) {
        FiltroDonacion filtro = new FiltroDonacion(
                input.getNombreFiltro(),
                input.getUsuarioId(),
                input.getCategoria(),
                input.getFechaDesde(),
                input.getFechaHasta(),
                input.getEliminado());
        FiltroDonacion actualizado = filtroDonacionService.actualizarFiltro(id, filtro);
        return convertirAGraphQL(actualizado);
    }

    @MutationMapping
    public Boolean eliminarFiltroDonacion(
            @Argument Long id,
            @Argument Long usuarioId) {
        return filtroDonacionService.eliminarFiltro(id, usuarioId);
    }

    // Clase interna para el input de GraphQL
    public static class FiltroDonacionInput {
        private String nombreFiltro;
        private Long usuarioId;
        private String categoria;
        private LocalDateTime fechaDesde;
        private LocalDateTime fechaHasta;
        private Boolean eliminado;

        // Getters y Setters
        public String getNombreFiltro() {
            return nombreFiltro;
        }

        public void setNombreFiltro(String nombreFiltro) {
            this.nombreFiltro = nombreFiltro;
        }

        public Long getUsuarioId() {
            return usuarioId;
        }

        public void setUsuarioId(Long usuarioId) {
            this.usuarioId = usuarioId;
        }

        public String getCategoria() {
            return categoria;
        }

        public void setCategoria(String categoria) {
            this.categoria = categoria;
        }

        public LocalDateTime getFechaDesde() {
            return fechaDesde;
        }

        public void setFechaDesde(LocalDateTime fechaDesde) {
            this.fechaDesde = fechaDesde;
        }

        public LocalDateTime getFechaHasta() {
            return fechaHasta;
        }

        public void setFechaHasta(LocalDateTime fechaHasta) {
            this.fechaHasta = fechaHasta;
        }

        public Boolean getEliminado() {
            return eliminado;
        }

        public void setEliminado(Boolean eliminado) {
            this.eliminado = eliminado;
        }
    }

    // Clase para representar FiltroDonacion en GraphQL (con ID como String)
    public static class FiltroDonacionGraphQL {
        private String id;
        private String nombreFiltro;
        private String usuarioId;
        private String categoria;
        private LocalDateTime fechaDesde;
        private LocalDateTime fechaHasta;
        private Boolean eliminado;
        private LocalDateTime fechaCreacion;

        // Getters y Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getNombreFiltro() {
            return nombreFiltro;
        }

        public void setNombreFiltro(String nombreFiltro) {
            this.nombreFiltro = nombreFiltro;
        }

        public String getUsuarioId() {
            return usuarioId;
        }

        public void setUsuarioId(String usuarioId) {
            this.usuarioId = usuarioId;
        }

        public String getCategoria() {
            return categoria;
        }

        public void setCategoria(String categoria) {
            this.categoria = categoria;
        }

        public LocalDateTime getFechaDesde() {
            return fechaDesde;
        }

        public void setFechaDesde(LocalDateTime fechaDesde) {
            this.fechaDesde = fechaDesde;
        }

        public LocalDateTime getFechaHasta() {
            return fechaHasta;
        }

        public void setFechaHasta(LocalDateTime fechaHasta) {
            this.fechaHasta = fechaHasta;
        }

        public Boolean getEliminado() {
            return eliminado;
        }

        public void setEliminado(Boolean eliminado) {
            this.eliminado = eliminado;
        }

        public LocalDateTime getFechaCreacion() {
            return fechaCreacion;
        }

        public void setFechaCreacion(LocalDateTime fechaCreacion) {
            this.fechaCreacion = fechaCreacion;
        }
    }
}

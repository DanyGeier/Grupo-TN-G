package com.grupog.informes.service;

import com.grupog.informes.model.FiltroDonacion;
import com.grupog.informes.repository.FiltroDonacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FiltroDonacionService {

    @Autowired
    private FiltroDonacionRepository filtroDonacionRepository;

    @Transactional
    public FiltroDonacion guardarFiltro(FiltroDonacion filtro) {
        // Validar que el usuario no tenga otro filtro con el mismo nombre
        List<FiltroDonacion> filtrosUsuario = filtroDonacionRepository
                .findByUsuarioIdOrderByFechaCreacionDesc(filtro.getUsuarioId());
        boolean nombreDuplicado = filtrosUsuario.stream()
                .anyMatch(f -> f.getNombreFiltro().equalsIgnoreCase(filtro.getNombreFiltro()));

        if (nombreDuplicado) {
            throw new IllegalArgumentException("Ya existe un filtro con el nombre: " + filtro.getNombreFiltro());
        }

        // Setear fecha de creación si no está seteada
        if (filtro.getFechaCreacion() == null) {
            filtro.setFechaCreacion(LocalDateTime.now());
        }

        return filtroDonacionRepository.save(filtro);
    }

    @Transactional
    public FiltroDonacion actualizarFiltro(Long id, FiltroDonacion filtroActualizado) {
        Optional<FiltroDonacion> optionalFiltro = filtroDonacionRepository.findById(id);

        if (optionalFiltro.isEmpty()) {
            throw new IllegalArgumentException("Filtro no encontrado con ID: " + id);
        }

        FiltroDonacion filtroExistente = optionalFiltro.get();

        // Validar que el usuario solo pueda actualizar sus propios filtros
        if (!filtroExistente.getUsuarioId().equals(filtroActualizado.getUsuarioId())) {
            throw new SecurityException("No tienes permisos para actualizar este filtro");
        }

        // Validar nombre único si cambió
        if (!filtroExistente.getNombreFiltro().equals(filtroActualizado.getNombreFiltro())) {
            List<FiltroDonacion> filtrosUsuario = filtroDonacionRepository
                    .findByUsuarioIdOrderByFechaCreacionDesc(filtroActualizado.getUsuarioId());
            boolean nombreDuplicado = filtrosUsuario.stream()
                    .anyMatch(f -> !f.getId().equals(id)
                            && f.getNombreFiltro().equalsIgnoreCase(filtroActualizado.getNombreFiltro()));

            if (nombreDuplicado) {
                throw new IllegalArgumentException(
                        "Ya existe un filtro con el nombre: " + filtroActualizado.getNombreFiltro());
            }
        }

        // Actualizar campos
        filtroExistente.setNombreFiltro(filtroActualizado.getNombreFiltro());
        filtroExistente.setCategoria(filtroActualizado.getCategoria());
        filtroExistente.setFechaDesde(filtroActualizado.getFechaDesde());
        filtroExistente.setFechaHasta(filtroActualizado.getFechaHasta());
        filtroExistente.setEliminado(filtroActualizado.getEliminado());

        return filtroDonacionRepository.save(filtroExistente);
    }

    @Transactional
    public boolean eliminarFiltro(Long id, Long usuarioId) {
        Optional<FiltroDonacion> optionalFiltro = filtroDonacionRepository.findById(id);

        if (optionalFiltro.isEmpty()) {
            throw new IllegalArgumentException("Filtro no encontrado con ID: " + id);
        }

        FiltroDonacion filtro = optionalFiltro.get();

        // Validar que el usuario solo pueda eliminar sus propios filtros
        if (!filtro.getUsuarioId().equals(usuarioId)) {
            throw new SecurityException("No tienes permisos para eliminar este filtro");
        }

        filtroDonacionRepository.delete(filtro);
        return true;
    }

    public List<FiltroDonacion> listarFiltrosPorUsuario(Long usuarioId) {
        return filtroDonacionRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
    }

    public Optional<FiltroDonacion> obtenerFiltroPorId(Long id) {
        return filtroDonacionRepository.findById(id);
    }
}

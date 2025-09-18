package com.grupog.mappers;

import com.grupog.Rol;

import java.time.Instant;

import com.grupog.CrearUsuarioRequest;
import com.grupog.EstadoUsuario;
import com.grupog.Usuario;
import com.grupog.entities.RolEntity;
import com.grupog.entities.UsuarioEntity;
import com.grupog.repositories.RolRepository;

public class UsuarioMapper {

    private final RolRepository rolRepository;

    public UsuarioMapper(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    public Usuario toProto(UsuarioEntity e) {
        return Usuario.newBuilder()
                .setId(e.getIdUsuario())
                .setNombreUsuario(e.getNombreUsuario())
                .setNombre(e.getNombre())
                .setApellido(e.getApellido())
                .setTelefono(e.getTelefono() != null ? e.getTelefono() : "")
                .setEmail(e.getEmail())
                .setRol(mapRolEntityToProto(e.getRol()))
                .setEstado(e.isActivo() ? EstadoUsuario.ACTIVO : EstadoUsuario.INACTIVO)
                .setFechaCreacion(e.getFechaCreacion() != null ? e.getFechaCreacion().toEpochMilli()
                        : Instant.now().toEpochMilli())
                .build();
    }

    public UsuarioEntity toEntity(CrearUsuarioRequest request) {
        UsuarioEntity entity = new UsuarioEntity();
        entity.setNombreUsuario(request.getNombreUsuario());
        entity.setNombre(request.getNombre());
        entity.setApellido(request.getApellido());
        entity.setTelefono(request.getTelefono());
        entity.setEmail(request.getEmail());
        entity.setClave("changeme"); // TODO Ver clave
        entity.setActivo(true);
        entity.setRol(mapRolProtoToEntity(request.getRol()));
        entity.setFechaCreacion(Instant.now());
        return entity;
    }

    public Rol mapRolEntityToProto(RolEntity rolEntity) {
        String nombre = rolEntity.getAuthority().replace("ROLE_", "");
        return Rol.valueOf(nombre);
    }

    public RolEntity mapRolProtoToEntity(Rol rol) {
        return rolRepository.findByNombreRol(rol.name())
                .orElseThrow(() -> new IllegalStateException("Rol inválido: " + rol.name()));
    }
}

package com.grupog.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupog.entities.UsuarioEntity;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {

	boolean existsByNombreUsuario(String nombreUsuario);

	boolean existsByEmail(String email);

	Optional<UsuarioEntity> findByEmail(String email);

	Optional<UsuarioEntity> findByIdUsuarioAndActivoTrue(Long idUsuario);

	Optional<UsuarioEntity> findByNombreUsuarioAndActivoTrue(String nombreUsuario);

	Optional<UsuarioEntity> findByEmailAndActivoTrue(String email);

	List<UsuarioEntity> findByActivoTrue();

	List<UsuarioEntity> findByRol_IdRolAndActivoTrue(Long idRol);
}

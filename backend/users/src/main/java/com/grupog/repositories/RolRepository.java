package com.grupog.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupog.entities.RolEntity;

@Repository
public interface RolRepository extends JpaRepository<RolEntity, Long> {

    Optional<RolEntity> findByNombreRol(String nombreRol);

    boolean existsByNombreRol(String nombreRol);
}

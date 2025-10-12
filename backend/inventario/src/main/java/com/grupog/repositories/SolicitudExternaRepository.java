package com.grupog.repositories;

import com.grupog.entities.SolicitudExternaEntity;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudExternaRepository extends JpaRepository<SolicitudExternaEntity, String> {

    // Buscar solo solicitudes activas
    List<SolicitudExternaEntity> findByActivaTrue();
}

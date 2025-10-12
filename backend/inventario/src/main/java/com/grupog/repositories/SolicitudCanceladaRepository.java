package com.grupog.repositories;

import com.grupog.entities.SolicitudCanceladaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudCanceladaRepository extends JpaRepository<SolicitudCanceladaEntity, Long> {

    boolean existsByIdSolicitudKafka(String idSolicitudKafka);
    
}
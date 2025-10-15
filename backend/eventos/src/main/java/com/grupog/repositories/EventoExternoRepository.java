package com.grupog.repositories;

import com.grupog.documents.EventoExternoDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventoExternoRepository extends MongoRepository<EventoExternoDocument, String> {

    Optional<EventoExternoDocument> findByIdOrganizacionAndIdEvento(Long idOrganizacion, String idEvento);

    @Query("{ 'activo': true, 'fecha_hora': { $gte: ?0 } }")
    List<EventoExternoDocument> findVigentes(LocalDateTime desde);

    @Query("{ 'id_organizacion': ?0, 'id_evento': ?1 }")
    Optional<EventoExternoDocument> findRaw(Long idOrganizacion, String idEvento);
}


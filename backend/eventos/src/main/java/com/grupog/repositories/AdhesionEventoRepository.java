package com.grupog.repositories;

import com.grupog.documents.AdhesionEventoDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdhesionEventoRepository extends MongoRepository<AdhesionEventoDocument, String> {

    // Buscar adhesiones por ID de evento
    List<AdhesionEventoDocument> findByIdEvento(String idEvento);

    // Buscar adhesión específica de un voluntario a un evento
    Optional<AdhesionEventoDocument> findByIdEventoAndIdOrganizacionVoluntarioAndIdVoluntario(
            String idEvento, Long idOrganizacionVoluntario, Long idVoluntario);

    // Buscar todas las adhesiones de una organización
    List<AdhesionEventoDocument> findByIdOrganizacionVoluntario(Long idOrganizacionVoluntario);
}


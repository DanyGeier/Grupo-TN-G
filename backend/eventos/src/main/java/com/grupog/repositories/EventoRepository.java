package com.grupog.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.grupog.documents.EventoDocument;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventoRepository extends MongoRepository<EventoDocument, String> {

    List<EventoDocument> findByActivoTrue();

    List<EventoDocument> findByFechaHoraEventoAfterAndActivoTrue(LocalDateTime fechaHora);

    List<EventoDocument> findByFechaHoraEventoBeforeAndActivoTrue(LocalDateTime fechaHora);

    @Query("{ 'participantes_ids': { $in: [?0] }, 'activo': true }")
    List<EventoDocument> findByParticipanteUsuarioId(Long usuarioId);

    @Query("{ 'participantes_ids': { $in: [?0] }, 'fecha_hora_evento': { $gt: ?1 }, 'activo': true }")
    List<EventoDocument> findByParticipanteUsuarioIdAndFechaHoraEventoAfter(Long usuarioId, LocalDateTime fechaHora);

    Optional<EventoDocument> findByIdAndActivoTrue(String id);

    @Query("{ 'usuario_creacion': ?0, 'activo': true }")
    List<EventoDocument> findByUsuarioCreacion(Long usuarioCreacion);

    @Query("{ 'fecha_hora_evento': { $gte: ?0, $lte: ?1 }, 'activo': true }")
    List<EventoDocument> findByFechaHoraEventoBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);

    @Query("{ 'fecha_hora_evento': { $lt: ?0 }, 'activo': true }")
    List<EventoDocument> findEventosPasados(LocalDateTime fechaActual);
}

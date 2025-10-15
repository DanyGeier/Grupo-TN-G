package com.grupog.consumers;

import com.grupog.events.EventoSolidarioEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.grupog.repositories.EventoExternoRepository;
import com.grupog.documents.EventoExternoDocument;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class EventoSolidarioListener {

    private static final Logger logger = LoggerFactory.getLogger(EventoSolidarioListener.class);

    @Value("${organizacion.id}")
    private Long idOrganizacion;

    @Autowired
    private EventoExternoRepository eventoExternoRepository;

    @KafkaListener(topics = "eventos-solidarios", containerFactory = "eventoSolidarioListenerFactory")
    public void consumirEventoSolidario(EventoSolidarioEvent evento) {
        // Ignoramos los mensajes de nuestra propia organizacion
        if (idOrganizacion.equals(evento.getIdOrganizacion())) {
            logger.info("-> Ignorando evento solidario propio (ID: {})", evento.getIdEvento());
            return;
        }

        logger.info("📅 ========================================");
        logger.info("📅 EVENTO SOLIDARIO RECIBIDO");
        logger.info("📅 ========================================");
        logger.info("📅 Organización: {}", evento.getIdOrganizacion());
        logger.info("📅 ID Evento: {}", evento.getIdEvento());
        logger.info("📅 Nombre: {}", evento.getNombreEvento());
        logger.info("📅 Descripción: {}", evento.getDescripcion());
        logger.info("📅 Fecha y Hora: {}", evento.getFechaHora());
        logger.info("📅 ========================================");

        // Guardar/actualizar el evento externo si está vigente (futuro)
        try {
            if (evento.getFechaHora() == null || evento.getFechaHora().isBefore(LocalDateTime.now())) {
                logger.info("-> Evento externo no vigente (pasado/sin fecha). Se descarta. ID: {}", evento.getIdEvento());
                return;
            }
            Optional<EventoExternoDocument> existenteOpt = eventoExternoRepository
                    .findByIdOrganizacionAndIdEvento(evento.getIdOrganizacion(), evento.getIdEvento());
            if (existenteOpt.isPresent()) {
                EventoExternoDocument existente = existenteOpt.get();
                if (Boolean.FALSE.equals(existente.getActivo())) {
                    // no reactivar si fue dado de baja
                    logger.info("-> Evento externo estaba dado de baja. Ignorando re-publicación. id={}", evento.getIdEvento());
                    return;
                }
                existente.setNombreEvento(evento.getNombreEvento());
                existente.setDescripcion(evento.getDescripcion());
                existente.setFechaHora(evento.getFechaHora());
                existente.setActivo(true);
                eventoExternoRepository.save(existente);
            } else {
                EventoExternoDocument doc = new EventoExternoDocument(
                        evento.getIdOrganizacion(),
                        evento.getIdEvento(),
                        evento.getNombreEvento(),
                        evento.getDescripcion(),
                        evento.getFechaHora());
                doc.setActivo(true);
                eventoExternoRepository.save(doc);
            }
        } catch (Exception e) {
            logger.error("Error al guardar evento externo: {}", e.getMessage(), e);
        }
    }
}

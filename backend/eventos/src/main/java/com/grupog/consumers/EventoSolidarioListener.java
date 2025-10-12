package com.grupog.consumers;

import com.grupog.events.EventoSolidarioEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class EventoSolidarioListener {

    private static final Logger logger = LoggerFactory.getLogger(EventoSolidarioListener.class);

    @Value("${organizacion.id}")
    private Long idOrganizacion;

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

        // TODO: Guardar el evento externo en MongoDB para que otras organizaciones
        // puedan consultarlo
        // Por ejemplo: eventoExternoRepository.save(...)
    }
}


package com.grupog.consumers;

import com.grupog.events.BajaEventoSolidarioEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.grupog.repositories.EventoExternoRepository;
import com.grupog.documents.EventoExternoDocument;
import java.util.Optional;

@Service
public class BajaEventoSolidarioListener {

    private static final Logger logger = LoggerFactory.getLogger(BajaEventoSolidarioListener.class);

    @Value("${organizacion.id}")
    private Long idOrganizacion;

    @Autowired
    private EventoExternoRepository eventoExternoRepository;

    @KafkaListener(topics = "baja-evento-solidario", containerFactory = "bajaEventoSolidarioListenerFactory")
    public void consumirBajaEvento(BajaEventoSolidarioEvent bajaEvento) {
        // Ignoramos los mensajes de nuestra propia organizacion
        if (idOrganizacion.equals(bajaEvento.getIdOrganizacion())) {
            logger.info("-> Ignorando baja de evento propio (ID: {})", bajaEvento.getIdEvento());
            return;
        }

        logger.info("📅 ========================================");
        logger.info("📅 BAJA DE EVENTO SOLIDARIO RECIBIDA");
        logger.info("📅 ========================================");
        logger.info("📅 Organización: {}", bajaEvento.getIdOrganizacion());
        logger.info("📅 ID Evento: {}", bajaEvento.getIdEvento());
        logger.info("📅 ========================================");

        try {
            Optional<EventoExternoDocument> existenteOpt = eventoExternoRepository
                    .findByIdOrganizacionAndIdEvento(bajaEvento.getIdOrganizacion(), bajaEvento.getIdEvento());
            if (existenteOpt.isPresent()) {
                EventoExternoDocument existente = existenteOpt.get();
                if (Boolean.TRUE.equals(existente.getActivo())) {
                    existente.setActivo(false);
                    eventoExternoRepository.save(existente);
                    logger.info("-> Evento externo marcado como INACTIVO por baja externa");
                } else {
                    logger.info("-> Evento externo ya estaba inactivo. Nada que actualizar.");
                }
            } else {
                logger.info("-> Baja recibida para evento no encontrado localmente. No se realiza acción.");
            }
        } catch (Exception e) {
            logger.error("Error procesando baja de evento externo: {}", e.getMessage(), e);
        }
    }
}

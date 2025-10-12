package com.grupog.consumers;

import com.grupog.events.AdhesionEventoEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class AdhesionEventoListener {

    private static final Logger logger = LoggerFactory.getLogger(AdhesionEventoListener.class);

    @Value("${organizacion.id}")
    private Long idOrganizacion;

    @KafkaListener(topics = "adhesion-evento", containerFactory = "adhesionEventoListenerFactory")
    public void consumirAdhesionEvento(AdhesionEventoEvent adhesion) {
        // Ignoramos los mensajes de voluntarios de nuestra propia organizacion
        if (adhesion.getVoluntario() != null &&
                idOrganizacion.equals(adhesion.getVoluntario().getIdOrganizacion())) {
            logger.info("-> Ignorando adhesión de voluntario propio al evento (ID: {})", adhesion.getIdEvento());
            return;
        }

        logger.info("📅 ========================================");
        logger.info("📅 ADHESIÓN A EVENTO RECIBIDA");
        logger.info("📅 ========================================");
        logger.info("📅 ID Evento: {}", adhesion.getIdEvento());

        if (adhesion.getVoluntario() != null) {
            AdhesionEventoEvent.Voluntario vol = adhesion.getVoluntario();
            logger.info("📅 Voluntario:");
            logger.info("📅   - Organización: {}", vol.getIdOrganizacion());
            logger.info("📅   - ID: {}", vol.getIdVoluntario());
            logger.info("📅   - Nombre: {} {}", vol.getNombre(), vol.getApellido());
            logger.info("📅   - Teléfono: {}", vol.getTelefono());
            logger.info("📅   - Email: {}", vol.getEmail());
        }

        logger.info("📅 ========================================");

        // TODO: Registrar la adhesión del voluntario externo al evento en MongoDB
        // Por ejemplo: adhesionRepository.save(...)
    }
}

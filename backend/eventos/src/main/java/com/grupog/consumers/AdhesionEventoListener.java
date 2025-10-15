package com.grupog.consumers;

import com.grupog.events.AdhesionEventoEvent;
import com.grupog.documents.AdhesionEventoDocument;
import com.grupog.repositories.AdhesionEventoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdhesionEventoListener {

    private static final Logger logger = LoggerFactory.getLogger(AdhesionEventoListener.class);

    @Value("${organizacion.id}")
    private Long idOrganizacion;

    @Autowired
    private AdhesionEventoRepository adhesionEventoRepository;

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

            // Guardar la adhesión en MongoDB
            try {
                // Verificar si ya existe esta adhesión
                Optional<AdhesionEventoDocument> existente = adhesionEventoRepository
                        .findByIdEventoAndIdOrganizacionVoluntarioAndIdVoluntario(
                                adhesion.getIdEvento(),
                                vol.getIdOrganizacion(),
                                vol.getIdVoluntario());

                if (existente.isPresent()) {
                    logger.info("-> Adhesión ya registrada previamente. No se duplica.");
                } else {
                    AdhesionEventoDocument doc = new AdhesionEventoDocument(
                            adhesion.getIdEvento(),
                            vol.getIdOrganizacion(),
                            vol.getIdVoluntario(),
                            vol.getNombre(),
                            vol.getApellido(),
                            vol.getTelefono(),
                            vol.getEmail()
                    );
                    adhesionEventoRepository.save(doc);
                    logger.info("-> Adhesión guardada exitosamente en MongoDB");
                }
            } catch (Exception e) {
                logger.error("Error al guardar adhesión: {}", e.getMessage(), e);
            }
        }

        logger.info("📅 ========================================");
    }
}

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

import java.util.List;
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
        if (adhesion.getVoluntario() == null) return;

        AdhesionEventoEvent.Voluntario vol = adhesion.getVoluntario();
        boolean esPropio = idOrganizacion.equals(vol.getIdOrganizacion());

        logger.info("📅 ========================================");
        logger.info("📅 ADHESIÓN A EVENTO RECIBIDA");
        logger.info("📅 ID Evento: {}", adhesion.getIdEvento());
        logger.info("📅 Voluntario: {} {} (Org: {}, ID: {})",
                vol.getNombre(), vol.getApellido(),
                vol.getIdOrganizacion(), vol.getIdVoluntario());
        logger.info("📅 Tipo: {}", esPropio ? "Propio" : "Ajeno");

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

        logger.info("📅 ========================================");
    }
}



package com.grupog.service;

import com.grupog.documents.AdhesionEventoDocument;
import com.grupog.events.AdhesionEventoEvent;
import com.grupog.repositories.AdhesionEventoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdhesionEventoService {

    private static final Logger logger = LoggerFactory.getLogger(AdhesionEventoService.class);
    private static final String TOPIC = "adhesion-evento";
private final AdhesionEventoRepository adhesionEventoRepository;
    @Autowired
    private KafkaTemplate<String, AdhesionEventoEvent> kafkaTemplate;

    public AdhesionEventoService(AdhesionEventoRepository adhesionEventoRepository) {
        this.adhesionEventoRepository = adhesionEventoRepository;
    }

    /**
     * Publica una adhesión de un voluntario a un evento en Kafka
     */
    public void publicarAdhesion(String idEvento, Long idOrganizacionVoluntario, Long idVoluntario,
                                   String nombre, String apellido, String telefono, String email) {

        AdhesionEventoEvent.Voluntario voluntario = new AdhesionEventoEvent.Voluntario(
                idOrganizacionVoluntario,
                idVoluntario,
                nombre,
                apellido,
                telefono,
                email
        );

        AdhesionEventoEvent evento = new AdhesionEventoEvent(idEvento, voluntario);

        try {
            kafkaTemplate.send(TOPIC, evento);
            logger.info("✅ Adhesión publicada en Kafka: Voluntario {} {} (ID: {}) al evento {}",
                    nombre, apellido, idVoluntario, idEvento);
        } catch (Exception e) {
            logger.error("❌ Error al publicar adhesión en Kafka: {}", e.getMessage(), e);
            throw new RuntimeException("Error al publicar adhesión en Kafka", e);
        }
    }

    public boolean estaAdherido(String idEvento, Long idVoluntario) {
        // Traer todas las adhesiones del evento
        List<AdhesionEventoDocument> adhesiones = adhesionEventoRepository.findByIdEvento(idEvento);

        // Verificar si alguna tiene el idVoluntario
        return adhesiones.stream()
                .anyMatch(a -> a.getIdVoluntario().equals(idVoluntario));
    }



}


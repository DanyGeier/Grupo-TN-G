package com.grupog.consumers;

import com.grupog.events.BajaEventoSolidarioEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class BajaEventoSolidarioListener {

    private static final Logger logger = LoggerFactory.getLogger(BajaEventoSolidarioListener.class);

    @Value("${organizacion.id}")
    private Long idOrganizacion;

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

        // TODO: Actualizar o eliminar el evento externo en MongoDB
        // Por ejemplo: eventoExternoRepository.deleteByIdEvento(...)
    }
}

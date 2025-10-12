package com.grupog.consumers;

import com.grupog.events.SolicitudDonacionEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class SolicitudDonacionListener {

    private static final Logger logger = LoggerFactory.getLogger(SolicitudDonacionListener.class);

    @KafkaListener(topics = "solicitud-donaciones", containerFactory = "solicitudDonacionListenerFactory")
    public void consumirSolicitudDonacion(SolicitudDonacionEvent solicitud) {
        logger.info("📥 ========================================");
        logger.info("📥 SOLICITUD DE DONACIÓN RECIBIDA");
        logger.info("📥 ========================================");
        logger.info("📥 Organización Solicitante: {}", solicitud.getIdOrganizacionSolicitante());
        logger.info("📥 ID Solicitud: {}", solicitud.getIdSolicitud());
        logger.info("📥 Total de items: {}", solicitud.getDonaciones() != null ? solicitud.getDonaciones().size() : 0);

        if (solicitud.getDonaciones() != null) {
            logger.info("📥 Items solicitados:");
            for (SolicitudDonacionEvent.DonacionItem item : solicitud.getDonaciones()) {
                logger.info("📥   - Categoría: {}, Descripción: {}", item.getCategoria(), item.getDescripcion());
            }
        }

        logger.info("📥 ========================================");
    }
}

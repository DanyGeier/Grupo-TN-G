package com.grupog.consumers;

import com.grupog.events.BajaSolicitudDonacionEvent;
import com.grupog.repositories.SolicitudExternaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class BajaSolicitudDonacionListener {

    @Autowired
    private SolicitudExternaRepository solicitudExternaRepository;

    private static final Logger logger = LoggerFactory.getLogger(BajaSolicitudDonacionListener.class);

    @Value("${organizacion.id}")
    private Long idOrganizacion;

    @KafkaListener(topics = "baja-solicitud-donaciones", containerFactory = "bajaSolicitudDonacionListenerFactory")
    public void consumirBajaSolicitud(BajaSolicitudDonacionEvent bajaSolicitud) {
        // Ignoramos los mensajes de nuestra propia organizacion
        if (idOrganizacion.equals(bajaSolicitud.getIdOrganizacionSolicitante())) {
            logger.info("-> Ignorando baja de solicitud propia (ID: {})", bajaSolicitud.getIdSolicitud());
            return;
        }

        logger.info("📥 ========================================");
        logger.info("📥 BAJA DE SOLICITUD DE DONACIÓN RECIBIDA");
        logger.info("📥 ========================================");
        logger.info("📥 Organización Solicitante: {}", bajaSolicitud.getIdOrganizacionSolicitante());
        logger.info("📥 ID Solicitud: {}", bajaSolicitud.getIdSolicitud());
        logger.info("📥 ========================================");

        // TODO: Completar
        // Por ejemplo, marcar la solicitud externa como cancelada o eliminarla
        solicitudExternaRepository.findById(bajaSolicitud.getIdSolicitud()).ifPresentOrElse(
                solicitud -> {
                    solicitud.setActiva(false);
                    solicitudExternaRepository.save(solicitud);
                    logger.info("Solicitud {} marcada como inactiva ✅", bajaSolicitud.getIdSolicitud());
                },
                () -> logger.warn("No se encontró la solicitud {} para marcarla como baja ", bajaSolicitud.getIdSolicitud())
        );

    }
}

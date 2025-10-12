package com.grupog.consumers;

import com.grupog.events.SolicitudDonacionEvent;
import com.grupog.entities.SolicitudExternaEntity;
import com.grupog.entities.ItemDonacionEntity;
import com.grupog.repositories.SolicitudExternaRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class SolicitudDonacionListener {

    @Autowired
    private SolicitudExternaRepository solicitudExternaRepository;

    @Value("${organizacion.id}")
    private Long idOrganizacion;

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

        if (idOrganizacion.equals(solicitud.getIdOrganizacionSolicitante())) {
            logger.info("-> Ignorando solicitud propia (ID: {})", solicitud.getIdSolicitud());
            return;
        }

        try {

            if (solicitudExternaRepository.existsById(solicitud.getIdSolicitud())) {
                logger.info("-> Solicitud ya procesada");
                return;
            }

            List<ItemDonacionEntity> donaciones = solicitud.getDonaciones().stream()
                    .map(item -> new ItemDonacionEntity(
                            item.getCategoria(),
                            item.getDescripcion()))
                    .collect(Collectors.toList());

            // Crear y guardar - JPA maneja todo automáticamente
            SolicitudExternaEntity nuevaSolicitud = new SolicitudExternaEntity(
                    solicitud.getIdSolicitud(),
                    solicitud.getIdOrganizacionSolicitante(),
                    donaciones);

            solicitudExternaRepository.save(nuevaSolicitud);

            logger.info("Solicitud guardada con {} donaciones", donaciones.size());

        } catch (Exception e) {
            logger.error("❌ Error al guardar la solicitud externa con ID {}: {}", solicitud.getIdSolicitud(),
                    e.getMessage());
        }
    }
}

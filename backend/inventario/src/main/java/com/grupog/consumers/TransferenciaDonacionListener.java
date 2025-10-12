package com.grupog.consumers;

import com.grupog.events.SolicitudDonacionEvent.DonacionItem;
import com.grupog.events.TransferirDonacionEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class TransferenciaDonacionListener {

    private static final Logger logger = LoggerFactory.getLogger(TransferenciaDonacionListener.class);

    @KafkaListener(topics = "transferencia-donaciones", containerFactory = "transferirDonacionListenerFactory")
    public void consumirTransferirDonacion(TransferirDonacionEvent transferencia) {
        logger.info("📥 ========================================");
        logger.info("📥 TRANSFERENCIA DE DONACIÓN RECIBIDA");
        logger.info("📥 ========================================");

        logger.info("📥 ID Solicitud: {}", transferencia.getIdSolicitud());
        logger.info("📥 ID Organización Donante: {}", transferencia.getIdOrganizacionDonante());
        logger.info("📥 Total de items: {}",
                transferencia.getDonaciones() != null ? transferencia.getDonaciones().size() : 0);

        if (transferencia.getDonaciones() != null) {

            logger.info("📥 Items transferidos:");

            for (DonacionItem item : transferencia.getDonaciones()) {
                logger.info("📥   - Categoría: {}, Descripción: {}", item.getCategoria(), item.getDescripcion());
            }

        }

        logger.info("📥 ========================================");
    }

}

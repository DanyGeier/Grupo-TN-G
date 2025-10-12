package com.grupog.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import com.grupog.entities.OfertaExternaEntity;
import com.grupog.repositories.OfertaExternaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.grupog.events.OfertaDonacionEvent;

@Service
public class OfertaDonacionListener {

    private static final Logger logger = LoggerFactory.getLogger(OfertaDonacionListener.class);

    @Value("${mi.organizacion.id}")
    private Long idOrganizacion;

    @Autowired
    private OfertaExternaRepository OfertaExternaRepository;

    //Convierte los objetos a JSON
    @Autowired
    private ObjectMapper objectMapper;
    
    @KafkaListener(topics = "oferta-donaciones", containerFactory =  "ofertaDonacionListenerFactory")
    public void consumirOfertaDonacion(OfertaDonacionEvent oferta) {
        //Ignoramos los mensajes de nuestra propia organizacion
        if (idOrganizacion.equals(oferta.getIdOrganizacionDonante())) {
            logger.info("-> Ignorando oferta de donacion propia recibidad (ID: {})", oferta.getIdOferta());
            return;
        }

        logger.info("📥 ========================================");
        logger.info("📥 OFERTA DE DONACIÓN RECIBIDA");
        logger.info("📥 ========================================");
        logger.info("📥 Organización Donante: {}", oferta.getIdOrganizacionDonante());
        logger.info("📥 ID Oferta: {}", oferta.getIdOferta());
        logger.info("📥 Total de items: {}", oferta.getDonacionesOfrecidas() != null ? oferta.getDonacionesOfrecidas().size() : 0);

        if(oferta.getDonacionesOfrecidas() != null && !oferta.getDonacionesOfrecidas().isEmpty()) {
            logger.info("📥 Items ofrecidos:");
            for (OfertaDonacionEvent.DetalleOfertaDonacion item : oferta.getDonacionesOfrecidas()) {
                logger.info("📥   - Categoría: {}, Descripción: {}, Cantidad: {}", 
                    item.getCategoria(), item.getDescripcion(), item.getCantidad());
            }
        }

        try { 
            //Convierte la lista de donaciones a un string JSON 
            String detallesJson = objectMapper.writeValueAsString(oferta.getDonacionesOfrecidas());

            OfertaExternaEntity nuevaOferta = new OfertaExternaEntity(
                oferta.getIdOferta(),
                oferta.getIdOrganizacionDonante(),
                detallesJson
            );

            //Se guarda en la base de datos
            OfertaExternaRepository.save(nuevaOferta);

            logger.info("📥 Oferta externa con ID {} guardada en la base de datos.", oferta.getIdOferta());

        } catch (Exception e) {
            logger.error("❌ Error al guardar la oferta externa con ID {}: {}", oferta.getIdOferta(), e.getMessage());
        }
    }
}

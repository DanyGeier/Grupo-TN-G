package com.grupog.consumers;

import com.grupog.events.BajaSolicitudDonacionEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class BajaSolicitudDonacionProducer { 

    private static final Logger logger = LoggerFactory.getLogger(BajaSolicitudDonacionProducer.class);
    private static final String TOPIC = "baja-solicitud-donaciones"; 

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void enviarBajaSolicitud(BajaSolicitudDonacionEvent bajaSolicitud) { 
        kafkaTemplate.send(TOPIC, bajaSolicitud.getIdSolicitud(), bajaSolicitud);
        logger.info("-> Notificación de BAJA enviada al topic: {}", bajaSolicitud.getIdSolicitud());
    }
}
package com.grupog.producers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.grupog.events.SolicitudDonacionEvent;

@Service
public class SolicitudDonacionProducer {

    private static final String TOPIC = "solicitud-donaciones";

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void enviarSolicitud(SolicitudDonacionEvent solicitud) {
        kafkaTemplate.send(TOPIC, solicitud.getIdSolicitud(), solicitud);
    }

}

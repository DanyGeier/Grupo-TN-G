package com.grupog.producers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.grupog.events.BajaSolicitudDonacionEvent;

@Service
public class BajaSolicitudDonacionProducer {

    private static final String TOPIC = "baja-solicitud-donaciones";

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void enviarBajaSolicitud(BajaSolicitudDonacionEvent bajaEvent) {
        kafkaTemplate.send(TOPIC, bajaEvent.getIdSolicitud(), bajaEvent);
    }
}

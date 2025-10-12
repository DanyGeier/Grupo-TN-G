package com.grupog.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.grupog.events.OfertaDonacionEvent;

@Service
public class OfertaDonacionProducer {

    private static final String TOPIC = "oferta-donaciones";

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void enviarMensaje(OfertaDonacionEvent oferta) {
        kafkaTemplate.send(TOPIC, oferta.getIdOferta(), oferta);
        System.out.println("Oferta de donacion enviada al topic " + TOPIC + ": " + oferta.getIdOferta());

    }
}

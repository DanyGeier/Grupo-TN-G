package com.grupog.producers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.grupog.events.TransferirDonacionEvent;

@Service
public class TransferenciaDonacionProducer {

    private static final String TOPIC = "transferencia-donaciones";

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void enviarTransferencia(TransferirDonacionEvent transferencia) {
        kafkaTemplate.send(TOPIC, transferencia.getIdSolicitud(), transferencia);
    }
}

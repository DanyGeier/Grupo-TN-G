package com.grupog.config;

import com.grupog.events.OfertaDonacionEvent;
import com.grupog.events.SolicitudDonacionEvent;
import com.grupog.events.TransferirDonacionEvent;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.kafka.core.*;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    @Value("${spring.kafka.consumer.transferencias-group-id}")
    private String transferenciasGroupId;

    @Value("${spring.kafka.consumer.auto-offset-reset}")
    private String autoOffsetReset;

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    // Factory para SolicitudDonacionEvent
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, SolicitudDonacionEvent> solicitudDonacionListenerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, SolicitudDonacionEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, autoOffsetReset);

        JsonDeserializer<SolicitudDonacionEvent> deserializer = new JsonDeserializer<>(SolicitudDonacionEvent.class);
        deserializer.setRemoveTypeHeaders(false);
        deserializer.addTrustedPackages("*");

        ConsumerFactory<String, SolicitudDonacionEvent> consumerFactory = new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                deserializer);

        factory.setConsumerFactory(consumerFactory);
        return factory;
    }

    // Factory para TransferirDonacionEvent
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TransferirDonacionEvent> transferirDonacionListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, TransferirDonacionEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, transferenciasGroupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, autoOffsetReset);

        JsonDeserializer<TransferirDonacionEvent> deserializer = new JsonDeserializer<>(TransferirDonacionEvent.class);
        deserializer.setRemoveTypeHeaders(false);
        deserializer.addTrustedPackages("*");

        ConsumerFactory<String, TransferirDonacionEvent> consumerFactory = new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                deserializer);

        factory.setConsumerFactory(consumerFactory);
        return factory;
    }

    // Factory para OfertaDonacionEvent
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, OfertaDonacionEvent> ofertaDonacionListenerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, OfertaDonacionEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, autoOffsetReset);

        JsonDeserializer<OfertaDonacionEvent> deserializer = new JsonDeserializer<>(OfertaDonacionEvent.class);
        deserializer.setRemoveTypeHeaders(false);
        deserializer.addTrustedPackages("*");

        ConsumerFactory<String, OfertaDonacionEvent> consumerFactory = new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                deserializer);

        factory.setConsumerFactory(consumerFactory);
        return factory;
    }
}

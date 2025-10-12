package com.grupog.configs;

import com.grupog.events.AdhesionEventoEvent;
import com.grupog.events.BajaEventoSolidarioEvent;
import com.grupog.events.EventoSolidarioEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    @Value("${spring.kafka.consumer.auto-offset-reset}")
    private String autoOffsetReset;

    // Factory para EventoSolidarioEvent
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, EventoSolidarioEvent> eventoSolidarioListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, EventoSolidarioEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, autoOffsetReset);

        JsonDeserializer<EventoSolidarioEvent> deserializer = new JsonDeserializer<>(EventoSolidarioEvent.class);
        deserializer.setRemoveTypeHeaders(false);
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeMapperForKey(false);

        ConsumerFactory<String, EventoSolidarioEvent> consumerFactory = new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                deserializer);

        factory.setConsumerFactory(consumerFactory);
        return factory;
    }

    // Factory para BajaEventoSolidarioEvent
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, BajaEventoSolidarioEvent> bajaEventoSolidarioListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, BajaEventoSolidarioEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, autoOffsetReset);

        JsonDeserializer<BajaEventoSolidarioEvent> deserializer = new JsonDeserializer<>(
                BajaEventoSolidarioEvent.class);
        deserializer.setRemoveTypeHeaders(false);
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeMapperForKey(false);

        ConsumerFactory<String, BajaEventoSolidarioEvent> consumerFactory = new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                deserializer);

        factory.setConsumerFactory(consumerFactory);
        return factory;
    }

    // Factory para AdhesionEventoEvent
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, AdhesionEventoEvent> adhesionEventoListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, AdhesionEventoEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, autoOffsetReset);

        JsonDeserializer<AdhesionEventoEvent> deserializer = new JsonDeserializer<>(AdhesionEventoEvent.class);
        deserializer.setRemoveTypeHeaders(false);
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeMapperForKey(false);

        ConsumerFactory<String, AdhesionEventoEvent> consumerFactory = new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                deserializer);

        factory.setConsumerFactory(consumerFactory);
        return factory;
    }
}

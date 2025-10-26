package com.grupog.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.grupog.documents.EventoDocument;
import com.grupog.dto.EventoDTO;

@Service
public class EventoInformeService {
    
    @Autowired
    public MongoTemplate mongoTemplate;

    public List<EventoDTO> buscarEventosConFiltros(LocalDateTime fechaDesde, LocalDateTime fechaHasta, Long usuarioId, String repartoDonaciones) {
        
        Query query = new Query();
        query.addCriteria(Criteria.where("activo").is(true));  //Eventos no cancelados

        if (fechaDesde != null && fechaHasta != null) {
            query.addCriteria(Criteria.where("fechaHoraEvento").gte(fechaDesde).lte(fechaHasta));
        }

        if (usuarioId != null && usuarioId > 0) {
            query.addCriteria(Criteria.where("participantesIds").is(usuarioId));
        }

        if (repartoDonaciones != null && !repartoDonaciones.isEmpty()) {
            boolean tieneDonaciones = repartoDonaciones.equals("SI");
            query.addCriteria(Criteria.where("donacionesRepartidas.0").exists(tieneDonaciones));
        }

        List<EventoDocument> eventosEncontrados = mongoTemplate.find(query, EventoDocument.class);

        return eventosEncontrados.stream()
            .map(this::mapearADTO)
            .collect(Collectors.toList());
    }

    //Clase a parte que convierte el documento de Mongo al DTO
    private EventoDTO mapearADTO(EventoDocument evento) {
        EventoDTO dto = new EventoDTO();
        dto.setId(evento.getId());
        dto.setNombreEvento(evento.getNombreEvento());
        dto.setDescripcion(evento.getDescripcion());
        dto.setFechaHoraEvento(evento.getFechaHoraEvento());
        dto.setTieneDonacionesRepartidas(!evento.getDonacionesRepartidas().isEmpty());
        return dto;
    }
}

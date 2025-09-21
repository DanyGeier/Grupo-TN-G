package com.grupog.mappers;

import com.grupog.*;
import com.grupog.documents.EventoDocument;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EventoMapper {

        public Evento toProto(EventoDocument documento) {
                // Convertir donaciones repartidas
                List<DonacionRepartida> donacionesProto = documento.getDonacionesRepartidas().stream()
                                .map(donacion -> DonacionRepartida.newBuilder()
                                                .setCategoria(donacion.getCategoria())
                                                .setDescripcion(donacion.getDescripcion())
                                                .setCantidadRepartida(donacion.getCantidadRepartida())
                                                .setFechaRepartida(
                                                                donacion.getFechaRepartida()
                                                                                .atZone(ZoneId.systemDefault())
                                                                                .toInstant().toEpochMilli())
                                                .setUsuarioRepartida(donacion.getUsuarioRepartidaId())
                                                .setNombreUsuarioRepartida(donacion.getNombreUsuarioRepartida())
                                                .build())
                                .collect(Collectors.toList());

                return Evento.newBuilder()
                                .setId(documento.getId())
                                .setNombreEvento(documento.getNombreEvento())
                                .setDescripcion(documento.getDescripcion() != null ? documento.getDescripcion() : "")
                                .setFechaHoraEvento(
                                                documento.getFechaHoraEvento().atZone(ZoneId.systemDefault())
                                                                .toInstant().toEpochMilli())
                                .addAllParticipantesIds(documento.getParticipantesIds())
                                .addAllDonacionesRepartidas(donacionesProto)
                                .setFechaCreacion(
                                                documento.getFechaCreacion().atZone(ZoneId.systemDefault()).toInstant()
                                                                .toEpochMilli())
                                .setUsuarioCreacion(documento.getUsuarioCreacion())
                                .setActivo(documento.getActivo())
                                .build();
        }

        public EventoDocument toDocument(CrearEventoRequest request, Long usuarioCreacion) {
                EventoDocument documento = new EventoDocument();
                documento.setNombreEvento(request.getNombreEvento());
                documento.setDescripcion(request.getDescripcion());
                documento.setFechaHoraEvento(LocalDateTime.ofInstant(
                                java.time.Instant.ofEpochMilli(request.getFechaHoraEvento()),
                                ZoneId.systemDefault()));
                documento.setUsuarioCreacion(usuarioCreacion);
                documento.setFechaCreacion(LocalDateTime.now());
                documento.setActivo(true);
                documento.setParticipantesIds(new java.util.ArrayList<>());
                documento.setDonacionesRepartidas(new java.util.ArrayList<>());
                return documento;
        }

        public EventoDocument toDocument(Evento eventoProto) {
                EventoDocument documento = new EventoDocument();
                documento.setId(eventoProto.getId());
                documento.setNombreEvento(eventoProto.getNombreEvento());
                documento.setDescripcion(eventoProto.getDescripcion());
                documento.setFechaHoraEvento(LocalDateTime.ofInstant(
                                java.time.Instant.ofEpochMilli(eventoProto.getFechaHoraEvento()),
                                ZoneId.systemDefault()));
                documento.setUsuarioCreacion(eventoProto.getUsuarioCreacion());
                documento.setFechaCreacion(LocalDateTime.ofInstant(
                                java.time.Instant.ofEpochMilli(eventoProto.getFechaCreacion()),
                                ZoneId.systemDefault()));
                documento.setActivo(eventoProto.getActivo());

                // Usar directamente los IDs de participantes
                documento.setParticipantesIds(eventoProto.getParticipantesIdsList());

                // Convertir donaciones repartidas
                List<EventoDocument.DonacionRepartidaSimple> donaciones = eventoProto.getDonacionesRepartidasList()
                                .stream()
                                .map(donacion -> new EventoDocument.DonacionRepartidaSimple(
                                                donacion.getCategoria(),
                                                donacion.getDescripcion(),
                                                donacion.getCantidadRepartida(),
                                                LocalDateTime.ofInstant(
                                                                java.time.Instant.ofEpochMilli(
                                                                                donacion.getFechaRepartida()),
                                                                ZoneId.systemDefault()),
                                                donacion.getUsuarioRepartida(),
                                                donacion.getNombreUsuarioRepartida()))
                                .collect(Collectors.toList());
                documento.setDonacionesRepartidas(donaciones);

                return documento;
        }

        public CategoriaDonacion mapStringToCategoriaDonacion(String categoria) {
                try {
                        return CategoriaDonacion.valueOf(categoria);
                } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Categoría de donación inválida: " + categoria);
                }
        }

        public String mapCategoriaDonacionToString(CategoriaDonacion categoria) {
                return categoria.name();
        }
}

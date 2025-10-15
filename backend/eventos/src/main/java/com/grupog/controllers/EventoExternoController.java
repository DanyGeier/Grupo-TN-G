package com.grupog.controllers;

import com.grupog.documents.EventoExternoDocument;
import com.grupog.repositories.EventoExternoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/externos")
public class EventoExternoController {

    @Autowired
    private EventoExternoRepository eventoExternoRepository;

    @GetMapping
    public ResponseEntity<?> listarExternos(
            @RequestParam(name = "soloFuturos", required = false, defaultValue = "false") boolean soloFuturos,
            @RequestParam(name = "incluirInactivos", required = false, defaultValue = "false") boolean incluirInactivos) {
        try {
            List<EventoExternoDocument> lista;
            if (soloFuturos) {
                lista = eventoExternoRepository.findVigentes(LocalDateTime.now());
            } else {
                lista = eventoExternoRepository.findAll().stream()
                        .filter(e -> incluirInactivos || Boolean.TRUE.equals(e.getActivo()))
                        .collect(Collectors.toList());
            }

            List<Map<String, Object>> resp = lista.stream().map(e -> {
                Map<String, Object> m = new HashMap<>();
                m.put("idOrganizacion", e.getIdOrganizacion());
                m.put("idEvento", e.getIdEvento());
                m.put("nombreEvento", e.getNombreEvento());
                m.put("descripcion", e.getDescripcion());
                if (e.getFechaHora() != null) {
                    Long fechaMs = e.getFechaHora().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
                    m.put("fechaHora", fechaMs);
                } else {
                    m.put("fechaHora", null);
                }
                m.put("activo", e.getActivo());
                return m;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(Collections.singletonMap("eventos", resp));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("error", ex.getMessage()));
        }
    }
}

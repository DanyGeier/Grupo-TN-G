package com.grupog.controllers;

import com.grupog.documents.AdhesionEventoDocument;
import com.grupog.repositories.AdhesionEventoRepository;
import com.grupog.service.AdhesionEventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/adhesiones")
public class AdhesionEventoController {

    @Autowired
    private AdhesionEventoRepository adhesionEventoRepository;

    @Autowired
    private AdhesionEventoService adhesionEventoService;

    /**
     * Listar todas las adhesiones de voluntarios externos a eventos propios
     */
    @GetMapping
    public ResponseEntity<?> listarAdhesiones(
            @RequestParam(name = "idEvento", required = false) String idEvento) {
        try {
            List<AdhesionEventoDocument> lista;

            if (idEvento != null && !idEvento.isEmpty()) {
                // Filtrar por evento específico
                lista = adhesionEventoRepository.findByIdEvento(idEvento);
            } else {
                // Todas las adhesiones
                lista = adhesionEventoRepository.findAll();
            }

            List<Map<String, Object>> resp = lista.stream().map(a -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", a.getId());
                m.put("idEvento", a.getIdEvento());
                m.put("idOrganizacionVoluntario", a.getIdOrganizacionVoluntario());
                m.put("idVoluntario", a.getIdVoluntario());
                m.put("nombre", a.getNombre());
                m.put("apellido", a.getApellido());
                m.put("telefono", a.getTelefono());
                m.put("email", a.getEmail());
                if (a.getFechaAdhesion() != null) {
                    Long fechaMs = a.getFechaAdhesion().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
                    m.put("fechaAdhesion", fechaMs);
                } else {
                    m.put("fechaAdhesion", null);
                }
                return m;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(Collections.singletonMap("adhesiones", resp));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(Collections.singletonMap("error", ex.getMessage()));
        }
    }

    /**
     * Adherirse a un evento externo (publica en Kafka)
     */
    @PostMapping
    public ResponseEntity<?> adherirseAEvento(@RequestBody Map<String, Object> request) {
        try {
            String idEvento = (String) request.get("idEvento");
            Long idOrganizacionVoluntario = getLong(request.get("idOrganizacionVoluntario"));
            Long idVoluntario = getLong(request.get("idVoluntario"));
            String nombre = (String) request.get("nombre");
            String apellido = (String) request.get("apellido");
            String telefono = (String) request.get("telefono");
            String email = (String) request.get("email");

            // Validaciones básicas
            if (idEvento == null || idEvento.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("error", "idEvento es requerido"));
            }
            if (idOrganizacionVoluntario == null || idVoluntario == null) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("error", "Datos del voluntario incompletos"));
            }

            // Publicar adhesión en Kafka
            adhesionEventoService.publicarAdhesion(
                    idEvento,
                    idOrganizacionVoluntario,
                    idVoluntario,
                    nombre,
                    apellido,
                    telefono,
                    email
            );

            return ResponseEntity.ok(Collections.singletonMap("mensaje", "Adhesión registrada exitosamente"));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(Collections.singletonMap("error", ex.getMessage()));
        }
    }

    private Long getLong(Object value) {
        if (value == null) return null;
        if (value instanceof Integer) return ((Integer) value).longValue();
        if (value instanceof Long) return (Long) value;
        if (value instanceof String) return Long.parseLong((String) value);
        return null;
    }
}


package com.grupog.informes.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import com.grupog.informes.model.EventoAgrupadoPorMes;
import com.grupog.informes.model.EventoInforme;
import com.grupog.informes.model.FiltroEventosInput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class InformeEventoService {

    @Autowired
    private RestTemplate restTemplate;

    public List<EventoAgrupadoPorMes> generarInforme(FiltroEventosInput filtro) {
        String url = "http://eventos:8082/eventos/informe";
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);

        if (filtro != null) {
            if (filtro.getUsuarioId() != null) {
                builder.queryParam("usuarioId", filtro.getUsuarioId());
            }
            if (filtro.getFechaDesde() != null) {
                builder.queryParam("fechaDesde", filtro.getFechaDesde().toString());
            }
            if (filtro.getFechaHasta() != null) {
                builder.queryParam("fechaHasta", filtro.getFechaHasta().toString());
            }
            if (filtro.getRepartoDonaciones() != null) {
                builder.queryParam("repartoDonaciones", filtro.getRepartoDonaciones());
            }
        }

        String uri = builder.build().toUriString();

        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                uri,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {
                });

        List<Map<String, Object>> eventos = resp.getBody() != null ? resp.getBody() : new ArrayList<>();
        List<EventoInforme> lista = new ArrayList<>();
        List<LocalDateTime> fechas = new ArrayList<>();

        for (Map<String, Object> e : eventos) {
            try {
                EventoInforme ei = new EventoInforme();

                // Mapear nombre del evento
                Object nombre = e.get("nombreEvento");
                if (nombre == null)
                    nombre = e.get("nombre");
                ei.setNombreEvento(nombre != null ? nombre.toString() : "");

                // Mapear descripción
                Object desc = e.get("descripcion");
                ei.setDescripcion(desc != null ? desc.toString() : "");

                // Mapear fecha
                LocalDateTime fecha = null;
                Object fobj = e.get("fechaHoraEvento");
                if (fobj == null)
                    fobj = e.get("fechaHora");

                if (fobj instanceof Number) {
                    fecha = LocalDateTime.ofInstant(
                            Instant.ofEpochMilli(((Number) fobj).longValue()),
                            ZoneId.systemDefault());
                } else if (fobj instanceof String) {
                    String s = (String) fobj;
                    try {
                        fecha = LocalDateTime.parse(s);
                    } catch (DateTimeParseException ex) {
                        try {
                            long millis = Long.parseLong(s);
                            fecha = LocalDateTime.ofInstant(
                                    Instant.ofEpochMilli(millis),
                                    ZoneId.systemDefault());
                        } catch (NumberFormatException ex2) {
                            try {
                                if (s.endsWith("Z")) {
                                    s = s.substring(0, s.length() - 1);
                                }
                                fecha = LocalDateTime.parse(s);
                            } catch (Exception ignored) {
                                // Ignorar errores de parsing
                            }
                        }
                    }
                }

                if (fecha != null) {
                    ei.setDia(fecha.getDayOfMonth());
                } else {
                    ei.setDia(0);
                }

                // Mapear donaciones
                Object don = e.get("tieneDonacionesRepartidas");
                if (don == null)
                    don = e.get("donaciones");
                if (don == null)
                    don = e.get("tieneDonaciones");

                boolean tiene = false;
                if (don instanceof Boolean) {
                    tiene = (Boolean) don;
                } else if (don instanceof Number) {
                    tiene = ((Number) don).intValue() != 0;
                } else if (don != null) {
                    String sd = don.toString().toLowerCase(Locale.ROOT);
                    tiene = sd.equals("true") || sd.equals("si") || sd.equals("sí") || sd.equals("1");
                }

                ei.setDonaciones(tiene);
                lista.add(ei);
                fechas.add(fecha);

            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        // Agrupar por mes
        Map<String, List<EventoInforme>> agrupado = new HashMap<>();
        for (int i = 0; i < lista.size(); i++) {
            LocalDateTime f = fechas.get(i);
            String key = (f != null) ? YearMonth.from(f).toString() : "unknown";
            agrupado.computeIfAbsent(key, k -> new ArrayList<>()).add(lista.get(i));
        }

        // Convertir a lista ordenada
        List<EventoAgrupadoPorMes> salida = agrupado.entrySet().stream()
                .map(ent -> {
                    EventoAgrupadoPorMes m = new EventoAgrupadoPorMes();
                    m.setMes(ent.getKey());
                    m.setEventos(ent.getValue());
                    return m;
                })
                .sorted(Comparator.comparing(EventoAgrupadoPorMes::getMes).reversed())
                .collect(Collectors.toList());

        return salida;
    }
}
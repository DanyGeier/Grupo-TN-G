package com.grupog.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.*;

import com.grupog.dto.EventoDTO;
import com.grupog.service.EventoInformeService;

@RestController
@RequestMapping("/eventos/informe")
public class EventoInformeController {

    @Autowired
    private EventoInformeService eventoInformeService;

    @GetMapping
    public List<EventoDTO> getEventosParaInforme(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHasta,
        @RequestParam(required = false) Long usuarioId,
        @RequestParam(required = false) String repartoDonaciones) {

            return eventoInformeService.buscarEventosConFiltros(
                fechaDesde, fechaHasta, usuarioId, repartoDonaciones);
        }
}

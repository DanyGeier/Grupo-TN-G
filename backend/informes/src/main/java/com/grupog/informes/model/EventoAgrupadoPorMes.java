package com.grupog.informes.model;

import java.util.List;
import lombok.Data;

@Data
public class EventoAgrupadoPorMes {
    private String mes;
    private List<EventoInforme> eventos;
}

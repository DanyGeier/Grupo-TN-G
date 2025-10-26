package com.grupog.informes.model;

import lombok.Data;

@Data
public class EventoInforme {
    private int dia;
    private String nombreEvento;
    private String descripcion;
    private boolean donaciones;
}

package com.grupog.informes.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonacionAgrupada {
    private String categoria;
    private Boolean eliminado;
    private Long totalCantidad;
}


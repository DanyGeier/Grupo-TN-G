package com.grupog.informes.model;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class FiltroEventosInput {
    private LocalDateTime fechaDesde;
    private LocalDateTime fechaHasta;
    private Long usuarioId;
    private String repartoDonaciones;
}

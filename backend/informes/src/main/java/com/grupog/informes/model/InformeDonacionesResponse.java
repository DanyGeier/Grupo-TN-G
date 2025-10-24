package com.grupog.informes.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InformeDonacionesResponse {
    private List<DonacionAgrupada> donaciones;
}


package com.grupog.informes.graphql;

import com.grupog.informes.model.DonacionAgrupada;
import com.grupog.informes.model.InformeDonacionesResponse;
import com.grupog.informes.service.InformeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import java.time.LocalDateTime;
import java.util.List;

@Controller
public class InformeGraphQLController {

    @Autowired
    private InformeService informeService;

    @QueryMapping
    public InformeDonacionesResponse informeDonaciones(
            @Argument String categoria,
            @Argument LocalDateTime fechaDesde,
            @Argument LocalDateTime fechaHasta,
            @Argument Boolean eliminado) {

        List<DonacionAgrupada> donaciones = informeService.obtenerInformeAgrupado(
            categoria, fechaDesde, fechaHasta, eliminado
        );

        return new InformeDonacionesResponse(donaciones);
    }
}


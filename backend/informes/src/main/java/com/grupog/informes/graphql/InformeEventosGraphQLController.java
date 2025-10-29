package com.grupog.informes.graphql;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.ContextValue;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.grupog.informes.model.EventoAgrupadoPorMes;
import com.grupog.informes.model.FiltroEventosInput;
import com.grupog.informes.service.InformeEventoService;
import com.grupog.informes.service.JwtService;

@Controller
public class InformeEventosGraphQLController {

    @Autowired
    private InformeEventoService informeService;

    @Autowired
    private JwtService jwtService;

    private static final String ROL_PRESIDENTE = "PRESIDENTE";
    private static final String ROL_COORDINADOR = "COORDINADOR";

    @QueryMapping
    public List<EventoAgrupadoPorMes> informeEventosPropios(
            @Argument FiltroEventosInput filtro,
            @ContextValue(required = false) String token) {

        if (filtro == null || filtro.getUsuarioId() == null) {
            throw new IllegalArgumentException("El filtro de usuario es obligatorio");
        }

        // Validar token si está presente
        if (token != null && !token.isEmpty()) {
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;

            if (jwtService.validarToken(jwtToken)) {
                String rol = jwtService.extraerRol(jwtToken);
                Long usuarioIdToken = jwtService.extraerUsuarioId(jwtToken);
                boolean esAdmin = ROL_PRESIDENTE.equals(rol) || ROL_COORDINADOR.equals(rol);

                if (!esAdmin && !filtro.getUsuarioId().equals(usuarioIdToken)) {
                    throw new IllegalArgumentException("Solo puedes consultar tus propios eventos");
                }
            }
        }

        return informeService.generarInforme(filtro);
    }
}
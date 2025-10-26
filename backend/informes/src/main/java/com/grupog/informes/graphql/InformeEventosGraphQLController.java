/** 
package com.grupog.informes.graphql;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;

import com.grupog.informes.model.EventoAgrupadoPorMes;
import com.grupog.informes.model.FiltroEventosInput;
import com.grupog.informes.model.Usuario;
//import com.grupog.informes.service.AuthService;
import com.grupog.informes.service.InformeEventoService;

@Controller
public class InformeEventosGraphQLController {
    
    @Autowired
    private InformeEventoService informeService;
/** 
    @Autowired
    private AuthService authService;

    private static final String ROL_PRESIDENTE = "PRESIDENTE";
    private static final String ROL_COORDINADOR = "COORDINADOR";

    
     * Responde a la query "informeEventosPropios" de GraphQL
     
    @QueryMapping
    public List<EventoAgrupadoPorMes> informeEventosPropios(
        @Argument FiltroEventosInput filtro,
        @RequestHeader("Authorization") String token) {
            
            Usuario usuarioActual = authService.validarTokenYObtenerUsuario(token);
            
            boolean esAdmin = usuarioActual.getRol().equals(ROL_PRESIDENTE) ||
                              usuarioActual.getRol().equals(ROL_COORDINADOR);

            if (filtro.getUsuarioId() == null) {
                throw new IllegalArgumentException("El filtro de usuario es obligatorio");
            }

            if (!esAdmin) {
                throw new AccessDeniedException("Acceso denegado: Solo se pueden consultar tus propios informes ");
            }
        return informeService.generarInforme(filtro);
    }
}

*/

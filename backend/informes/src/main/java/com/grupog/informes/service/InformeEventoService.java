package com.grupog.informes.service;

import java.util.List;
import com.grupog.informes.model.EventoAgrupadoPorMes;
import com.grupog.informes.model.EventoInforme;
import com.grupog.informes.model.FiltroEventosInput;
import com.grupog.informes.model.Evento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class InformeEventoService {
    
    @Autowired
    private RestTemplate restTemplate;

    public List<EventoAgrupadoPorMes> generarInforme(FiltroEventosInput filtro) {
        String url = "http://eventos-service:8082/eventos/informe";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("usuarioId", filtro.getUsuarioId());

        
    }
}

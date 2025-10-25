package com.grupog.informes.soap.controller;

import com.grupog.informes.soap.client.SoapClientService;
import com.grupog.informes.soap.dto.AssociationDTO;
import com.grupog.informes.soap.dto.InformeCompletoDTO;
import com.grupog.informes.soap.dto.PresidentDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/soap/informe")
public class PresidentOngController {


    private final SoapClientService soapClientService;

    public PresidentOngController(SoapClientService soapClientService) {
        this.soapClientService = soapClientService;
    }

    @PostMapping("/presidentes")
    public List<PresidentDTO> getPresidentsByOrgIds(@RequestBody List<Long> orgIds) {
        return soapClientService.listPresidentsByOrgIds(orgIds);
    }

    @PostMapping("/organizaciones")
    public List<AssociationDTO> getOngs(@RequestBody List<Long> orgIds) {

        return soapClientService.listOrganizations(orgIds);
    }

    @PostMapping("/presidentes-ongs")
    public List<InformeCompletoDTO> getPresidentesAndOngs(@RequestBody List<Long> orgIds) {

        return soapClientService.listPresidentesAndOngs(orgIds);
    }
}

package com.grupog.informes.soap.client;


import com.grupog.informes.soap.auth.AuthHeaderHandler;
import com.grupog.informes.soap.dto.AssociationDTO;
import com.grupog.informes.soap.dto.InformeCompletoDTO;
import com.grupog.informes.soap.dto.PresidentDTO;
import com.grupog.soapclient.*;

import jakarta.xml.ws.BindingProvider;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;



@Service
public class SoapClientService {

    private final Application applicationPort;

    public SoapClientService() {
        SoapApi soapApi = new SoapApi();
        this.applicationPort = soapApi.getApplication();

        // Agregar el handler personalizado
        ((BindingProvider) applicationPort).getBinding()
                .setHandlerChain(List.of(new AuthHeaderHandler()));
    }


    public List<PresidentDTO> listPresidentsByOrgIds(List<Long> orgIdsList) {
        // Convertir la lista de Long a StringArray (SOAP)
        StringArray orgIds = new StringArray();
        orgIdsList.forEach(id -> orgIds.getString().add(String.valueOf(id)));

        // Llamar al método SOAP
        PresidentTypeArray presidentArray = applicationPort.listPresidents(orgIds);

        // Mapear a DTO
        return presidentArray.getPresidentType().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private PresidentDTO mapToDTO(PresidentType p) {
        PresidentDTO dto = new PresidentDTO();
        dto.setId(p.getId() != null && p.getId().getValue() != null ? p.getId().getValue().longValue() : null);
        dto.setName(p.getName() != null ? p.getName().getValue() : null);
        dto.setAddress(p.getAddress() != null ? p.getAddress().getValue() : null);
        dto.setPhone(p.getPhone() != null ? p.getPhone().getValue() : null);
        dto.setOrganizationId(p.getOrganizationId() != null && p.getOrganizationId().getValue() != null
                ? p.getOrganizationId().getValue().longValue()
                : null);
        return dto;
    }


    private AssociationDTO mapToDTO(OrganizationType o) {
        AssociationDTO dto = new AssociationDTO();
        dto.setId(o.getId() != null && o.getId().getValue() != null ? o.getId().getValue().longValue() : null);
        dto.setName(o.getName() != null ? o.getName().getValue() : null);
        dto.setAddress(o.getAddress() != null ? o.getAddress().getValue() : null);
        dto.setPhone(o.getPhone() != null ? o.getPhone().getValue() : null);
        return dto;
    }

    public List<AssociationDTO> listOrganizations(List<Long> orgIdsList) {
        // Crear el array de IDs
        StringArray orgIds = new StringArray();
        orgIdsList.forEach(id -> orgIds.getString().add(String.valueOf(id)));

        // Agregar header de autenticación
        Map<String, Object> reqContext = ((BindingProvider) applicationPort).getRequestContext();
        reqContext.put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, "https://soap-app-latest.onrender.com/");


        // Llamar al método SOAP
        OrganizationTypeArray orgArray = applicationPort.listAssociations(orgIds);

        // Mapear respuesta
        return orgArray.getOrganizationType().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<InformeCompletoDTO> listPresidentesAndOngs(List<Long> orgIdsList) {
        List<AssociationDTO> organizaciones = listOrganizations(orgIdsList);
        List<PresidentDTO> presidentes = listPresidentsByOrgIds(orgIdsList);

        return orgIdsList.stream().map(id -> {
            AssociationDTO org = organizaciones.stream()
                    .filter(o -> o.getId().equals(id))
                    .findFirst().orElse(null);

            PresidentDTO pres = presidentes.stream()
                    .filter(p -> p.getOrganizationId().equals(id))
                    .findFirst().orElse(null);

            return new InformeCompletoDTO(org, pres);
        }).toList();
    }

}
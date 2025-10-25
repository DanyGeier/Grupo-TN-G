package com.grupog.informes.soap.dto;

public class InformeCompletoDTO {
        AssociationDTO associationDTO;
        PresidentDTO presidentDTO;

    public PresidentDTO getPresidentDTO() {
        return presidentDTO;
    }

    public void setPresidentDTO(PresidentDTO presidentDTO) {
        this.presidentDTO = presidentDTO;
    }

    public AssociationDTO getAssociationDTO() {
        return associationDTO;
    }

    public void setAssociationDTO(AssociationDTO associationDTO) {
        this.associationDTO = associationDTO;
    }

    public InformeCompletoDTO(AssociationDTO associationDTO, PresidentDTO presidentDTO) {
        this.associationDTO = associationDTO;
        this.presidentDTO = presidentDTO;
    }

    @Override
    public String toString() {
        return "InformeCompletoDTO{" +
                "associationDTO=" + associationDTO +
                ", presidentDTO=" + presidentDTO +
                '}';
    }


}
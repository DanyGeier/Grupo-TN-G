export interface AssociationDTO {
  id: number;
  name: string;
  address: string;
  phone: string;
}


export interface PresidentDTO {
  id: number;
  name: string;
  address: string;
  phone: string;
  organizationId: number;
}

export interface InformeCompletoDTO {
  associationDTO: AssociationDTO;
  presidentDTO: PresidentDTO;
}
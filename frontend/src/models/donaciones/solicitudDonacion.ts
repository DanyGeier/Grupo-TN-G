import type { DonacionItem } from "./donacionItem";

export interface SolicitudDonacion {
  idOrganizacionSolicitante: number;
  idSolicitud: number;
  donaciones: DonacionItem[];
  //activa:boolean
}
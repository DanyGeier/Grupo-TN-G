import type { Donacion, DonacionPost } from "./donacion";

export interface SolicitudDonacion {
  idSolicitud: string;                  
  idOrganizacionSolicitante: number;  
  donaciones: Donacion[];              
  activa: boolean;                    
  fechaRecepcion: Date;             
}

export interface SolicitudDonacionPost {

   donaciones: DonacionPost[];

}
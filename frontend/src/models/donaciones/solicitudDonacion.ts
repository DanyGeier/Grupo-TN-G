import type { Donacion, DonacionPost, DonacionSolicitada } from "./donacion";

export interface SolicitudDonacion {
  idSolicitud: number;                  
  idOrganizacion: number;  
  donaciones: DonacionSolicitada[];              
  //activa: boolean;                    
  //fechaRecepcion: Date;             
}

export interface SolicitudDonacionPost {

   donaciones: DonacionSolicitada[];

}
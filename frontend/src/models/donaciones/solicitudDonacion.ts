import type { ItemDonacion } from "./itemDonacion";

export interface SolicitudDonacion {
  idSolicitud: string;                  
  idOrganizacion: number;  
  donaciones:  ItemDonacion[];              
  //activa: boolean;                    
  //fechaRecepcion: Date;             
}

export interface SolicitudDonacionDto {

  donaciones:  ItemDonacion[];              
  //activa: boolean;                    
  //fechaRecepcion: Date;             
}




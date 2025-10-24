import type { ItemDonacion } from "./itemDonacion";

export interface TransferenciaDonacion {
  idOrganizacion: number;
  idSolicitud: string;
  donaciones: ItemDonacion[];

}



export interface TransferenciaDonacionPost {

  idSolicitud: string;
  donaciones:  ItemDonacion[];              
  //activa: boolean;                    
  //fechaRecepcion: Date;             
}



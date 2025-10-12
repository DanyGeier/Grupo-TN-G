import type { Donacion, DonacionPost } from "./donacion";


export interface OfertaDonacion {
  idOrganizacionSolicitante: number;
  idOferta: number;
  donaciones: Donacion[];

}

export interface OfertaDonacionPost {

  donaciones: DonacionPost[];

}
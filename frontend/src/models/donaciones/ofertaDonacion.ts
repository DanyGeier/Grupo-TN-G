import type { Donacion, DonacionPost } from "./donacion";


export interface OfertaDonacion {
  idOrganizacion: number;
  idOferta: number;
  donaciones: Donacion[];

}

export interface OfertaDonacionPost {

  donaciones: DonacionPost[];

}
import type { Donacion,  } from "./donacion";


export interface OfertaDonacion {
  idOrganizacion: number;
  idOferta: number;
  donaciones: Donacion[];

}

export interface OfertaDonacionDto{

  donacionesOfrecidas: DetalleOferta[];

}

export interface DetalleOferta{
  categoria: string,      
  descripcion: string,
      cantidad: number



}
import type { Donacion } from "./donacion";

export interface OfertaDonacion {
  idOrganizacionSolicitante: number;
  idOferta: number;
  donaciones: Donacion[];

}
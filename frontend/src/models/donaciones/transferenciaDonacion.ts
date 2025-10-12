import type { Donacion, DonacionPost } from "./donacion";

export interface TransferenciaDonacion {
  idOrganizacionSolicitante: number;
  idTransferencia: string;
  donaciones: Donacion[];

}

export interface TransferenciaDonacionPost {

  donaciones: DonacionPost[];

}
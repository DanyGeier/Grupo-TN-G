import type { Donacion, DonacionPost } from "./donacion";

export interface TransferenciaDonacion {
  idOrganizacion: number;
  idTransferencia: string;
  donaciones: Donacion[];

}

export interface TransferenciaDonacionPost {

  donaciones: DonacionPost[];

}
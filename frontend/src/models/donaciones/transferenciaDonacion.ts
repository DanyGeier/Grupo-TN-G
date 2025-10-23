import type { Donacion } from "./donacion";

export interface TransferenciaDonacion {
  idOrganizacion: number;
  idTransferencia: string;
  donaciones: Donacion[];

}

export interface TransferenciaDonacionPost {


}
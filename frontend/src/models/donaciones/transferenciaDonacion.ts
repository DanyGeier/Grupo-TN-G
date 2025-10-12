import type { Donacion } from "./donacion";

export interface TransferenciaDonacion {
  idOrganizacionSolicitante: number;
  idTransferencia: string;
  donaciones: Donacion[];

}
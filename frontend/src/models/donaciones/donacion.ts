export interface Donacion {
  id: number;
  categoria: string;
  descripcion: string;
  cantidad?: number;
}

export interface DonacionSolicitada {
  categoria: string;
  descripcion: string;
};

export interface DonacionPost {

  categoria: string;
  descripcion: string;
  cantidad?: number;
}
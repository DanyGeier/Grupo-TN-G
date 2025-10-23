export interface AdhesionEvento {
  idEvento: number;
  voluntario: Voluntario;
}

export interface Voluntario {
  idOrganizacion: number;
  idVoluntario: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}
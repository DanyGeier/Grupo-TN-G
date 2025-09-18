export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email: string;
  rol: string;
  activo: boolean;
}

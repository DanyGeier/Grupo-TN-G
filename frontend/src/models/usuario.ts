export interface Usuario {
  id: number;
  nombreUsuario: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email: string;
  rol: string;
  activo: boolean;
}

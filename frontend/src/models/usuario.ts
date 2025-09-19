export interface Usuario {
  id: number;
  nombreUsuario: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email: string;
  rol: number;
  estado: boolean;
}



//Este es el que va

// export interface Usuario {
//   id: number;
//   nombreUsuario: string;
//   nombre: string;
//   apellido: string;
//   email: string;
//   rol: number; 
//   estado: number; // 0 = activo, 1 = inactivo, 2 = suspendido
// }

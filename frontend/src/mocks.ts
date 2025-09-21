import type { InventarioItemDto } from "./models/dto/inventarioItemDto";
import type { UsuarioDto } from "./models/dto/usuarioDto";
import type { EventoResponse } from "./models/eventoResponse";

export const usuarios: UsuarioDto[] = [
  { id: 1, nombre: "Juan", apellido: "Pérez" },
  { id: 2, nombre: "María", apellido: "Gómez" },
  { id: 3, nombre: "Carlos", apellido: "Ramírez" },
  { id: 4, nombre: "Lucía", apellido: "Fernández" },
  { id: 5, nombre: "Pedro", apellido: "Santos" },
  { id: 6, nombre: "Ana", apellido: "Vega" },
  { id: 7, nombre: "Sofía", apellido: "Mendoza" },
  { id: 8, nombre: "Diego", apellido: "Ríos" },
  { id: 9, nombre: "Valentina", apellido: "Ortiz" },
  { id: 10, nombre: "Matías", apellido: "Cabrera" },
];

export const inventarioItems: InventarioItemDto[] = [
  { categoria: "ROPA", nombre: "Remeras", descripcion: "Remeras para niños", cantidad: 50 },
  { categoria: "ROPA", nombre: "Pantalones", descripcion: "Pantalones para niñas", cantidad: 30 },
  { categoria: "ALIMENTOS", nombre: "Leche", descripcion: "Leche en polvo", cantidad: 40 },
  { categoria: "ALIMENTOS", nombre: "Arroz", descripcion: "Bolsas de arroz", cantidad: 100 },
  { categoria: "JUGUETES", nombre: "Pelotas", descripcion: "Pelotas de fútbol", cantidad: 25 },
  { categoria: "JUGUETES", nombre: "Muñecas", descripcion: "Muñecas para niñas", cantidad: 20 },
  { categoria: "UTILES_ESCOLARES", nombre: "Cuadernos", descripcion: "Cuadernos rayados", cantidad: 80 },
  { categoria: "UTILES_ESCOLARES", nombre: "Lápices", descripcion: "Lápices de colores", cantidad: 150 },
  { categoria: "ALIMENTOS", nombre: "Fideos", descripcion: "Paquetes de fideos", cantidad: 60 },
  { categoria: "ROPA", nombre: "Chaquetas", descripcion: "Chaquetas para invierno", cantidad: 15 },
];

 export const eventos: EventoResponse[] = [
  {
    id: 1,
    nombreEvento: "Donación de Ropa",
    descripcion: "Recolecta ropa para niños y niñas",
    fechaHora: new Date("2025-09-25T10:00:00"),
    miembros: [usuarios[0], usuarios[1], usuarios[2]],
    donaciones: [inventarioItems[0], inventarioItems[1], inventarioItems[9]],
  },
  {
    id: 2,
    nombreEvento: "Entrega de Alimentos",
    descripcion: "Distribución de alimentos básicos",
    fechaHora: new Date("2025-09-28T15:00:00"),
    miembros: [usuarios[3], usuarios[4], usuarios[5]],
    donaciones: [inventarioItems[2], inventarioItems[3], inventarioItems[8]],
  },
  {
    id: 3,
    nombreEvento: "Juguetes Solidarios",
    descripcion: "Donación de juguetes a escuelas",
    fechaHora: new Date("2025-10-01T11:00:00"),
    miembros: [usuarios[6], usuarios[7], usuarios[8]],
    donaciones: [inventarioItems[4], inventarioItems[5]],
  },
  {
    id: 4,
    nombreEvento: "Útiles Escolares",
    descripcion: "Entrega de útiles escolares",
    fechaHora: new Date("2025-10-05T09:30:00"),
    miembros: [usuarios[0], usuarios[4], usuarios[9]],
    donaciones: [inventarioItems[6], inventarioItems[7]],
  },
  {
    id: 5,
    nombreEvento: "Gran Evento Solidario",
    descripcion: "Combinación de ropa, alimentos y juguetes",
    fechaHora: new Date("2025-10-10T14:00:00"),
    miembros: [usuarios[1], usuarios[3], usuarios[5], usuarios[7], usuarios[9]],
    donaciones: [inventarioItems[0], inventarioItems[2], inventarioItems[4], inventarioItems[6]],
  },
];
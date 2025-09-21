import type { UsuarioDto } from "./dto/usuarioDto";
import type { InventarioItem } from "./inventarioItem";

export interface Evento {
  id: number;
  nombreEvento: string;
  descripcion: string;
  fechaHora: Date;
  miembros: UsuarioDto[];
  donaciones: InventarioItem[];
}


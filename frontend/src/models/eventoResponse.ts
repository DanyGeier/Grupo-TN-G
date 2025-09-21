import type { InventarioItemDto } from "./dto/inventarioItemDto";
import type { UsuarioDto } from "./dto/usuarioDto";

export interface EventoResponse {
  id: number;
  nombreEvento: string;
  descripcion: string;
  fechaHora: Date;
  miembros: UsuarioDto[];
  donaciones: InventarioItemDto[];

}


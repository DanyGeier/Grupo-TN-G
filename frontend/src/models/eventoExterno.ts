export interface EventoExterno {
  idOrganizacion: number;
  nombreOrganizacion: string;
  idEvento: number;
  nombreEvento: string;
  descripcion: string;
  fechaHora: string; // ISO 8601
  //activo:boolean;
}

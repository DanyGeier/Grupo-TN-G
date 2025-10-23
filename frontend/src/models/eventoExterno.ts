export interface EventoExternoResponse {
  idOrganizacion: number;    // ID de la organización
  idEvento: number;          // ID del evento dentro de la organización
  nombreEvento: string;
  descripcion: string;
  fechaHora: string;         // ISO string, ej: "2025-10-23T10:00:00"
  activo: boolean;
}


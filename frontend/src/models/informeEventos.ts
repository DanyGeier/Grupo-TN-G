export interface FiltroEventosInput {
  usuarioId: number;
  fechaDesde?: string;
  fechaHasta?: string;
  repartoDonaciones?: string;
}

export interface EventoInforme {
  dia: number;
  nombreEvento: string;
  descripcion: string;
  donaciones: boolean;
}

export interface EventoAgrupadoPorMes {
  mes: string;
  eventos: EventoInforme[];
}

export interface InformeEventosResponse {
  informeEventosPropios: EventoAgrupadoPorMes[];
}
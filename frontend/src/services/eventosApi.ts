import type { EventoResponse } from "../models/eventoResponse";
import type { CrearEventoRequest } from "../models/crearEventoRequest";
import type { EventoExternoResponse } from "../models/eventoExterno";
import type { AdhesionEvento, Voluntario } from "../models/adhesionEvento";

const API_BASE_URL = "http://localhost:5000";

// Interfaces para la respuesta del backend
interface ParticipanteApi {
    id: number;
    nombre: string;
    apellido: string;
}

interface EventoApiResponse {
    id: string;
    nombreEvento: string;
    descripcion: string;
    fechaHoraEvento: number;
    participantesIds: number[];
    participantes?: ParticipanteApi[];
    donacionesRepartidas: DonacionRepartidaApi[];
    fechaCreacion: number;
    usuarioCreacion: number;
    activo: boolean;
}

interface DonacionRepartidaApi {
    categoria: string;
    descripcion: string;
    cantidadRepartida: number;
    fechaRepartida: number;
    usuarioRepartida: number;
    nombreUsuarioRepartida: string;
}

interface ListarEventosResponse {
    eventos: EventoApiResponse[];
}

interface InventarioActivoItemApi {
    id: number;
    categoria: string;
    descripcion: string;
    cantidad: number;
}

class EventosApiService {
    
    private getAuthHeaders(): HeadersInit {
        
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    async listarEventos(soloFuturos: boolean = false): Promise<EventoResponse[]> {
        const response = await fetch(
            `${API_BASE_URL}/eventos?soloFuturos=${soloFuturos}`,
            {
                method: "GET",
                headers: this.getAuthHeaders(),
            }
        );
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data: ListarEventosResponse = await response.json();
        return data.eventos.map(this.mapEventoApiToFrontend);
    }

    async obtenerEvento(id: string): Promise<EventoResponse> {
        const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data: EventoApiResponse = await response.json();
        return this.mapEventoApiToFrontend(data);
    }

    async crearEvento(evento: CrearEventoRequest): Promise<EventoResponse> {
        const response = await fetch(`${API_BASE_URL}/eventos`, {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
                nombreEvento: evento.nombreEvento,
                descripcion: evento.descripcion,
                fechaHoraEvento: evento.fechaHora.getTime()
            }),
        });
        if (!response.ok) {
            const data = await response.json().catch(()=>null);
            throw new Error(data?.error || `Error ${response.status}: ${response.statusText}`);
        }
        const data: EventoApiResponse = await response.json();
        return this.mapEventoApiToFrontend(data);
    }

    async actualizarEvento(evento: { id: string; nombreEvento: string; descripcion: string; fechaHora: Date; participantesIds?: number[]; activo?: boolean; }): Promise<EventoResponse> {
        const payload = {
            id: evento.id,
            nombreEvento: evento.nombreEvento,
            descripcion: evento.descripcion,
            fechaHoraEvento: evento.fechaHora.getTime(),
            participantesIds: evento.participantesIds ?? [],
            activo: evento.activo ?? true,
        };
        const response = await fetch(`${API_BASE_URL}/eventos/${evento.id}`, {
            method: "PUT",
            headers: this.getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const data = await response.json().catch(()=>null);
            throw new Error(data?.error || `Error ${response.status}: ${response.statusText}`);
        }
        const data: EventoApiResponse = await response.json();
        return this.mapEventoApiToFrontend(data);
    }

    async eliminarEvento(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
            method: "DELETE",
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            const data = await response.json().catch(()=>null);
            throw new Error(data?.error || `Error ${response.status}: ${response.statusText}`);
        }
    }

    async asignarParticipante(eventoId: string, usuarioId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/participantes`, {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ usuarioId }),
        });
        if (!response.ok) {
            const data = await response.json().catch(()=>null);
            throw new Error(data?.error || `Error ${response.status}`);
        }
    }

    async quitarParticipante(eventoId: string, usuarioId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/participantes/${usuarioId}`, {
            method: "DELETE",
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            const data = await response.json().catch(()=>null);
            throw new Error(data?.error || `Error ${response.status}`);
        }
    }

    async registrarDonacion(eventoId: string, donacion: { categoria: string; descripcion: string; cantidad: number; }): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/donaciones`, {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
                categoria: donacion.categoria,
                descripcion: donacion.descripcion,
                cantidad: donacion.cantidad,
            }),
        });
        if (!response.ok) {
            const data = await response.json().catch(()=>null);
            throw new Error(data?.error || `Error ${response.status}`);
        }
    }

    async listarInventarioActivo(): Promise<InventarioActivoItemApi[]> {
        const response = await fetch(`${API_BASE_URL}/eventos/inventario-activo`, {
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            const data = await response.json().catch(()=>null);
            throw new Error(data?.error || `Error ${response.status}`);
        }
        const data = await response.json();
        return (data.items as InventarioActivoItemApi[]) ?? [];
    }

    private mapEventoApiToFrontend(eventoApi: EventoApiResponse): EventoResponse {
        const miembros = Array.isArray(eventoApi.participantes)
            ? eventoApi.participantes.map(p => ({ id: p.id, nombre: p.nombre, apellido: p.apellido }))
            : (Array.isArray(eventoApi.participantesIds)
                ? eventoApi.participantesIds.map(id => ({ id, nombre: `Usuario`, apellido: `${id}` }))
                : []);
        return {
            id: eventoApi.id,
            nombreEvento: eventoApi.nombreEvento || "Sin nombre",
            descripcion: eventoApi.descripcion || "Sin descripción",
            fechaHora: new Date(eventoApi.fechaHoraEvento || Date.now()),
            miembros,
            donaciones: Array.isArray(eventoApi.donacionesRepartidas)
                ? eventoApi.donacionesRepartidas.map(donacion => ({
                    categoria: donacion.categoria || "SIN_CATEGORIA",
                    nombre: donacion.descripcion || "Sin nombre",
                    descripcion: donacion.descripcion || "Sin descripción",
                    cantidad: donacion.cantidadRepartida || 0
                }))
                : []
        };
    }


    //--------------------------------
    //Eventos Externos
    //------------------------------
async listarEventosExternos(soloFuturos: boolean = false): Promise<EventoExternoResponse[]> {
    let url = `${API_BASE_URL}/eventos/externos`;

    if (soloFuturos) {
        url += '?soloFuturos=true';
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || `Error ${response.status}`);
    }

    const data: { eventos: EventoExternoResponse[] } = await response.json();
    return data.eventos;
}



async enviarAdhesionEvento(adhesion: AdhesionEvento): Promise<void> {
  const url = `${API_BASE_URL}/eventos/adherirse/${adhesion.idEvento}`;

  const response = await fetch(url, {
    method: "POST",
    headers: this.getAuthHeaders(),
    body: JSON.stringify(adhesion),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || `Error ${response.status}`);
  }
}

    
}

export type { InventarioActivoItemApi };
export const eventosApiService = new EventosApiService();

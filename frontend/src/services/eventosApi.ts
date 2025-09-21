import type { EventoResponse } from "../models/eventoResponse";
import type { CrearEventoRequest } from "../models/crearEventoRequest";

const API_BASE_URL = "http://localhost:5000";

// Interfaces para la respuesta del backend
interface EventoApiResponse {
    id: string;
    nombreEvento: string;
    descripcion: string;
    fechaHoraEvento: number;
    participantesIds: number[];
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

class EventosApiService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    async listarEventos(soloFuturos: boolean = false): Promise<EventoResponse[]> {
        try {
            console.log("[API SERVICE] Obteniendo eventos del backend");

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
            console.log("[API SERVICE] Eventos recibidos:", data.eventos.length);

            // Mapear la respuesta del backend al formato del frontend
            return data.eventos.map(this.mapEventoApiToFrontend);
        } catch (error) {
            console.error("[API SERVICE] Error al obtener eventos:", error);
            throw error;
        }
    }

    async crearEvento(evento: CrearEventoRequest): Promise<EventoResponse> {
        try {
            console.log("[API SERVICE] Creando evento:", evento.nombreEvento);

            const response = await fetch(`${API_BASE_URL}/eventos`, {
                method: "POST",
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    nombreEvento: evento.nombreEvento,
                    descripcion: evento.descripcion,
                    fechaHoraEvento: evento.fechaHora.getTime() // Convertir Date a timestamp
                }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data: EventoApiResponse = await response.json();
            console.log("[API SERVICE] Evento creado:", data.id);
            console.log("[API SERVICE] Datos recibidos:", JSON.stringify(data, null, 2));

            return this.mapEventoApiToFrontend(data);
        } catch (error) {
            console.error("[API SERVICE] Error al crear evento:", error);
            throw error;
        }
    }

    async eliminarEvento(id: string): Promise<void> {
        try {
            console.log("[API SERVICE] Eliminando evento:", id);

            const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
                method: "DELETE",
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            console.log("[API SERVICE] Evento eliminado exitosamente");
        } catch (error) {
            console.error("[API SERVICE] Error al eliminar evento:", error);
            throw error;
        }
    }

    private mapEventoApiToFrontend(eventoApi: EventoApiResponse): EventoResponse {
        console.log("[API SERVICE] Mapeando evento:", eventoApi);

        return {
            id: eventoApi.id,
            nombreEvento: eventoApi.nombreEvento || "Sin nombre",
            descripcion: eventoApi.descripcion || "Sin descripción",
            fechaHora: new Date(eventoApi.fechaHoraEvento || Date.now()),
            // Mapeo simple: mostrar solo IDs de usuarios (con validación)
            miembros: Array.isArray(eventoApi.participantesIds)
                ? eventoApi.participantesIds.map(id => ({
                    id,
                    nombre: `Usuario`,
                    apellido: `${id}`
                }))
                : [],
            // Mapeo simple de donaciones (con validación)
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
}

export const eventosApiService = new EventosApiService();

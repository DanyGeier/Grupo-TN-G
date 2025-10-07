// src/components/events/EventPage.tsx

import { useNavigate } from "react-router-dom";
import type { EventoResponse } from "../../models/eventoResponse";
import { useState, useEffect } from "react";
import { EventoCard } from "./EventoCard";
import { Header } from "../Header";
import { eventosApiService } from "../../services/eventosApi";

import { useUser } from "../../context/UserContext";
export const ListaEventos = () => {
  const [eventos, setEventos] = useState<EventoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { usuario } = useUser();

  // Cargar eventos del backend
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("[FRONTEND] Cargando eventos desde el backend...");

        const eventosData = await eventosApiService.listarEventos(false);
        setEventos(eventosData);

        console.log("[FRONTEND] Eventos cargados exitosamente:", eventosData.length);
        console.log("[FRONTEND] Eventos:", eventosData);
      } catch {
        console.error("[FRONTEND] Error al cargar eventos");
        setError("Error al cargar eventos. Verifica que el backend esté ejecutándose.");
      } finally {
        setLoading(false);
      }
    };

    cargarEventos();
  }, []);

  const handleToggleParticipation = async (eventoId: string) => {
    if (!usuario) return;
    const participa = eventos
      .find(e => e.id === eventoId)?.miembros.some(m => m.id === usuario.id);
    try {
      if (participa) {
        await eventosApiService.quitarParticipante(eventoId, usuario.id);
        setEventos(prev => prev.map(e => e.id === eventoId ? {
          ...e,
          miembros: e.miembros.filter(m => m.id !== usuario.id)
        } : e));
      } else {
        await eventosApiService.asignarParticipante(eventoId, usuario.id);
        setEventos(prev => prev.map(e => e.id === eventoId ? {
          ...e,
          miembros: [...e.miembros, { id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido }]
        } : e));
      }
    } catch {
      alert("No se pudo actualizar la participación");
    }
  };

  const handleEdit = (event: EventoResponse) => {
    navigate(`/eventos/${event.id}/editar`);
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;

    try {
      console.log("[FRONTEND] Eliminando evento:", eventId);
      await eventosApiService.eliminarEvento(eventId);

      setEventos((prev) => prev.filter((e) => e.id !== eventId));
      console.log("[FRONTEND] Evento eliminado exitosamente");
    } catch (e: any) {
      console.error("[FRONTEND] Error al eliminar evento", e);
      alert(e?.message || "Error al eliminar el evento. Inténtalo de nuevo.");
    }
  };

  const puedeCrearEvento = usuario?.rol === 0 || usuario?.rol === 2;

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Eventos Solidarios</h2>

        {/* Estado de carga */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-lg text-gray-700 dark:text-gray-200">Cargando eventos...</div>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="px-4 py-3 rounded mb-4 border border-red-400 text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900/30">
            {error}
          </div>
        )}

        {/* Lista de eventos */}
        {!loading && !error && (
          <div className="grid gap-4">
            {eventos.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No hay eventos disponibles
              </div>
            ) : (
              eventos.map((evento) => (
                <EventoCard
                  key={evento.id}
                  evento={evento}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleParticipation={handleToggleParticipation}
                />
              ))
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col">
          {puedeCrearEvento && (
            <button
              onClick={() => navigate("/eventos/nuevo")}
              className="hover:bg-blue-600 cursor-pointer bg-blue-500 rounded-xl text-lg py-3 text-white"
            >
              Crear nuevo evento
            </button>
          )}
        </div>
      </div>
    </>
  );
};

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
  const { usuario, logoutUser } = useUser();

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
      } catch (err) {
        console.error("[FRONTEND] Error al cargar eventos:", err);
        setError("Error al cargar eventos. Verifica que el backend esté ejecutándose.");
      } finally {
        setLoading(false);
      }
    };

    cargarEventos();
  }, []);

  //   const handleEdit = (event: Evento) => {
  //   navigate(`/eventos/${event.id}/editar`);
  //   };

  //   // const handleDelete = async (eventId: number) => {
  //   //   if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;

  //   //   try {
  //   //     await eliminarEvento(eventId);

  //   //     // 👇 Actualizamos el estado filtrando el eliminado
  //   //     setEvents((prev) => prev.filter((e) => e.id !== eventId));
  //   //   } catch (err) {
  //   //     console.error(err);
  //   //     alert("No se pudo eliminar el evento");
  //   //   }
  //   // };

  //   // const handleToggleParticipation = (eventId: number) => {
  //   //   console.log("Unirse/Salir del evento", eventId);
  //   // };

  const handleToggleParticipation = (eventId: number) => {
    console.log("Unirse/Salir del evento", eventId);
  };

  const handleEdit = (event: EventoResponse) => {
    navigate(`/eventos/${event.id}/editar`);
  };

  const handleDelete = async (eventId: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;

    try {
      console.log("[FRONTEND] Eliminando evento:", eventId);
      await eventosApiService.eliminarEvento(eventId.toString());

      // Actualizamos el estado filtrando el evento eliminado
      setEventos((prev) => prev.filter((e) => e.id !== eventId));
      console.log("[FRONTEND] Evento eliminado exitosamente");
    } catch (err) {
      console.error("[FRONTEND] Error al eliminar evento:", err);
      alert("Error al eliminar el evento. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Eventos Solidarios</h2>

        {/* Estado de carga */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-lg">Cargando eventos...</div>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Lista de eventos */}
        {!loading && !error && (
          <div className="grid gap-4">
            {eventos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
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
          {usuario?.rol === 0 && (
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

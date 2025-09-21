// src/components/events/EventPage.tsx

import { useNavigate } from "react-router-dom";
import type { EventoResponse } from "../../models/eventoResponse";
import { useState } from "react";
import { eventos } from "../../mocks";
import { EventoCard } from "./EventoCard";
import { Header } from "../Header";

import { useUser } from "../../context/UserContext";
export const ListaEventos = () => {
  const [eventosMock, setEventosMock] = useState<EventoResponse[]>(eventos);
  const navigate = useNavigate();
  const { usuario, logoutUser } = useUser();
  //   const [events, setEvents] = useState<Evento[]>([]);
  // // La llamada al backend, despues ubicarla en un servicio o algo por el estilo

  //   // useEffect(() => {
  //   //   fetch("http://localhost:5000/eventos")
  //   //     .then((res) => res.json())
  //   //     .then((data) => setEvents(data))
  //   //     .catch((err) => console.error("Error al cargar eventos:", err));
  //   // }, []);

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

  const handleDelete = (eventId: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;

    // Actualizamos el estado filtrando el evento eliminado
    setEventosMock((prev) => prev.filter((e) => e.id !== eventId));
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Eventos Solidarios</h2>

        <div className="grid gap-4">
          {eventosMock.map((evento) => (
            <EventoCard
              key={evento.id}
              evento={evento}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleParticipation={handleToggleParticipation}
            />
          ))}
        </div>

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

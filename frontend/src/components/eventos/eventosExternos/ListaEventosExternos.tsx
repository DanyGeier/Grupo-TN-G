import React, { useEffect, useState } from "react";
import { EventoExternoCard } from "./EventoExternoCard";
import { Header } from "../../Header";
import type { EventoExternoResponse } from "../../../models/eventoExterno";
import { eventosApiService } from "../../../services/eventosApi";


export const ListaEventosExternos: React.FC = () => {
  const [eventos, setEventos] = useState<EventoExternoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const data = await eventosApiService.listarEventosExternos();
        setEventos(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar los eventos");
      } finally {
        setLoading(false);
      }
    };

    cargarEventos();
  }, []);

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Eventos Externos
        </h2>

        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Cargando eventos...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && eventos.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No hay eventos disponibles.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento) => (
            <EventoExternoCard key={evento.idEvento} evento={evento} />
          ))}
        </div>
      </div>
    </>
  );
};

import React from "react";
import type { EventoExterno } from "../../../models/eventoExterno";

interface Props {
  evento: EventoExterno;
}

export const EventoExternoCard: React.FC<Props> = ({ evento }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500">
      <div>
        <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wide">
          {evento.nombreOrganizacion}
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        {evento.nombreEvento}
      </h3>

      <p className="text-gray-700 dark:text-gray-200">{evento.descripcion}</p>

      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {new Date(evento.fechaHora).toLocaleString()}
      </p>

      <button
        onClick={() => alert(`Te has adherido al evento: ${evento.nombreEvento}`)}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
      >
        Adherirse al evento
      </button>
    </div>
  );
};

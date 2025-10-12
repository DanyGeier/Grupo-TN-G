import React from "react";
import { EventoExternoCard } from "./EventoExternoCard";
import { Header } from "../../Header";
import type { EventoExterno } from "../../../models/eventoExterno";


export const ListaEventosExternos: React.FC = () => {
  const eventosSimulados: EventoExterno[] = [
    {
      idOrganizacion: 1,
      nombreOrganizacion: "Empuje Solidario",
      idEvento: 101,
      nombreEvento: "Campaña de Alimentos",
      descripcion: "Recolección de alimentos para familias necesitadas",
      fechaHora: "2025-10-15T10:00:00",
    },
    {
      idOrganizacion: 2,
      nombreOrganizacion: "Manos Solidarias",
      idEvento: 102,
      nombreEvento: "Donación de Ropa",
      descripcion:
        "Entrega de ropa de invierno a personas en situación de calle",
      fechaHora: "2025-10-16T14:30:00",
    },
    {
      idOrganizacion: 3,
      nombreOrganizacion: "Sonrisas",
      idEvento: 103,
      nombreEvento: "Recolección de Juguetes",
      descripcion: "Recogida de juguetes para niños de bajos recursos",
      fechaHora: "2025-10-18T09:00:00",
    },
    {
      idOrganizacion: 4,
      nombreOrganizacion: "Salud para Todos",
      idEvento: 104,
      nombreEvento: "Campaña de Salud",
      descripcion: "Jornada de vacunación y atención médica gratuita",
      fechaHora: "2025-10-20T08:30:00",
    },
    {
      idOrganizacion: 5,
      nombreOrganizacion: "EcoAmigos",
      idEvento: 105,
      nombreEvento: "Limpieza Comunitaria",
      descripcion: "Actividad de limpieza y concientización ambiental",
      fechaHora: "2025-10-22T11:00:00",
    },
  ];

  return (
    <>
      <Header></Header>
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Eventos Externos 
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosSimulados.map((evento) => (
            <EventoExternoCard key={evento.idEvento} evento={evento} />
          ))}
        </div>
      </div>
    </>
  );
};

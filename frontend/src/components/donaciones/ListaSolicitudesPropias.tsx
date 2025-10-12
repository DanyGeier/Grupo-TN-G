import React, { useEffect, useState } from "react";
import { Header } from "../Header";
import { CardSolicitudDonacion } from "./CardSolicitudDonacion";
import type { SolicitudDonacion } from "../../models/donaciones/solicitudDonacion";
import { useNavigate } from "react-router-dom";

// Función de datos de prueba
const generarDatosDePrueba = (): SolicitudDonacion[] => {
  const categorias = ["ALIMENTOS", "ROPA", "MEDICAMENTOS", "JUGUETES", "HIGIENE"];
  const descripciones = ["Puré de tomates", "Camisas", "Ibuprofeno", "Pelota de futbol", "Jabón"];

  return Array.from({ length: 10 }, (_, i) => ({
    idOrganizacion: i + 1,
    idSolicitud: 100 + i,
    donaciones: Array.from({ length: 3 }, () => ({
      id: Math.floor(Math.random() * 1000),
      categoria: categorias[Math.floor(Math.random() * categorias.length)],
      descripcion: descripciones[Math.floor(Math.random() * descripciones.length)],
      cantidad: Math.floor(Math.random() * 10) + 1,
    })),
  }));
};

export const ListaSolicitudesPropias: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudDonacion[]>([]);
  const navigate = useNavigate();
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<SolicitudDonacion | null>(null);

  useEffect(() => {
    setSolicitudes(generarDatosDePrueba());
  }, []);

  const handleNuevaSolicitud = () => {
    // Futuro: abrir modal o redirigir a formulario
    navigate("/donaciones/solicitar");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Solicitudes de Donaciones de Empuje Solidario
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solicitudes.map((solicitud) => (
            <CardSolicitudDonacion
              key={solicitud.idSolicitud}
              solicitud={solicitud}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={handleNuevaSolicitud}
            className="hover:bg-blue-600 cursor-pointer bg-blue-500 rounded-xl text-lg py-3 text-white px-6"
          >
            Realizar nueva solicitud
          </button>
        </div>
      </div>
    </>
  );
};

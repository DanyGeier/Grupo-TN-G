import React, { useState } from "react";
import type { EventoExternoResponse } from "../../../models/eventoExterno";
import type { AdhesionEvento } from "../../../models/adhesionEvento";
import { useUser } from "../../../context/UserContext";
import { eventosApiService } from "../../../services/eventosApi";

interface Props {
  evento: EventoExternoResponse;
}

export const EventoExternoCard: React.FC<Props> = ({ evento }) => {
  const { usuario } = useUser();
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdherirse = async () => {
    if (!usuario) {
      setMensaje("Debes iniciar sesión para adherirte al evento.");
      return;
    }

    const adhesion: AdhesionEvento = {
      idEvento: evento.idEvento,
      voluntario: {
        idOrganizacion: 12,
        idVoluntario: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: "123",
        email: usuario.email,
      },
    };
    console.log(adhesion)
    try {
      setLoading(true);
      await eventosApiService.enviarAdhesionEvento(adhesion);
      setMensaje(`✅ Te has adherido al evento: ${evento.nombreEvento}`);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Ocurrió un error al adherirte al evento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        {evento.nombreEvento}
      </h3>

      <p className="text-gray-700 dark:text-gray-200">{evento.descripcion}</p>

      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {new Date(evento.fechaHora).toLocaleString()}
      </p>

      <button
        onClick={handleAdherirse}
        disabled={loading}
        className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adhiriendo..." : "Adherirse al evento"}
      </button>

      {mensaje && (
        <p className={`mt-2 text-sm ${mensaje.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
          {mensaje}
        </p>
      )}
    </div>
  );
};

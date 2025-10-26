import React, { useEffect, useState } from "react";
import type { EventoExternoResponse } from "../../../models/eventoExterno";
import { useUser } from "../../../context/UserContext";
import { eventosApiService } from "../../../services/eventosApi";
import type { Voluntario } from "../../../models/adhesionEvento";

interface Props {
  evento: EventoExternoResponse;
  eventosAdheridos?: string[];
}

export const EventoExternoCard: React.FC<Props> = ({ evento, eventosAdheridos = [] }) => {
  const { usuario } = useUser();
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [adherido, setAdherido] = useState<boolean>(
    eventosAdheridos.includes(evento.idEvento)
  );

  // ✅ Verificación inicial: consultar al gateway si ya está adherido
  useEffect(() => {
    const checkAdhesion = async () => {
      if (!usuario) return; // si no hay usuario logueado, no verificar

      try {
        const data = await eventosApiService.verificarAdhesion(
          evento.idEvento,
          usuario.id,
          "ORG-001"
        );
        setAdherido(data.adherido);
      } catch (error) {
        console.error("Error verificando adhesión:", error);
      }
    };

    checkAdhesion();
  }, [usuario, evento.idEvento]);

  // ✅ Maneja la adhesión al evento
  const handleAdherirse = async () => {
    if (!usuario) {
      setMensaje("Debes iniciar sesión para adherirte al evento.");
      return;
    }

    if (adherido) {
      setMensaje("✅ Ya estás adherido a este evento.");
      return;
    }

    const voluntario: Voluntario = {
      idOrganizacionVoluntario: 123, // Ajustar según tu lógica
      idVoluntario: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      telefono: usuario.telefono || "",
      email: usuario.email || "",
    };

    try {
      setLoading(true);
      console.log("📤 Enviando adhesión:", { idEvento: evento.idEvento, voluntario });

      await eventosApiService.enviarAdhesionEvento(evento.idEvento, voluntario);

      console.log("📥 Adhesión registrada correctamente");
      setMensaje(`✅ Te has adherido al evento: ${evento.nombreEvento}`);
      setAdherido(true);
    } catch (error) {
      console.error("Error al adherirse al evento:", error);
      setMensaje("Ocurrió un error al adherirte al evento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{evento.nombreEvento}</h3>

      <p className="text-gray-700 dark:text-gray-200">{evento.descripcion}</p>

      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {new Date(evento.fechaHora).toLocaleString()}
      </p>

      <button
        onClick={handleAdherirse}
        disabled={loading || adherido}
        className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${
          loading || adherido ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {adherido ? "Ya estás adherido" : loading ? "Adhiriendo..." : "Adherirse al evento"}
      </button>

      {mensaje && (
        <p
          className={`mt-2 text-sm ${
            mensaje.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
};

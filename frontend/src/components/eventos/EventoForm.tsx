import { useState, useEffect } from "react";

import { Header } from "../Header";
import { useNavigate, useParams } from "react-router-dom";
import type { CrearEventoRequest } from "../../models/crearEventoRequest";
import { eventosApiService } from "../../services/eventosApi";

export const EventoForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaHora, setFechaHora] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarEvento = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const evento = await eventosApiService.obtenerEvento(id);
        setNombre(evento.nombreEvento);
        setDescripcion(evento.descripcion);
        setFechaHora(evento.fechaHora);
      } catch (e: any) {
        setError(e?.message || "No se pudo cargar el evento");
      } finally {
        setLoading(false);
      }
    };
    cargarEvento();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fechaHora) {
      setError("Por favor selecciona una fecha y hora");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (id) {
        await eventosApiService.actualizarEvento({
          id,
          nombreEvento: nombre,
          descripcion,
          fechaHora,
        });
      } else {
        const nuevoEventoDTO: CrearEventoRequest = {
          nombreEvento: nombre,
          descripcion,
          fechaHora: fechaHora,
        };
        await eventosApiService.crearEvento(nuevoEventoDTO);
      }

      alert(id ? "Evento actualizado ✅" : "Evento creado exitosamente ✅");
      navigate("/eventos");
    } catch (e: any) {
      setError(e?.message || (id
        ? "Error al actualizar el evento. Verifica permisos y backend."
        : "Error al crear el evento. Verifica backend y permisos.")
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Header></Header>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors px-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {id ? "Editar evento" : "Crear nuevo evento"}
        </h2>

        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mt-4 w-full max-w-xl">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 px-10 py-8 rounded-2xl mt-8 shadow-lg w-full max-w-xl"
        >
          <div>
            <label className="text-lg font-medium text-gray-800 dark:text-gray-100">Nombre del evento</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="Ingrese el nombre del evento"
            />
          </div>

          <div className="mt-4">
            <label className="text-lg font-medium text-gray-800 dark:text-gray-100">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="Ingrese una descripción"
            />
          </div>

          <div className="mt-4">
            <label className="text-lg font-medium text-gray-800 dark:text-gray-100">Fecha</label>
            <input
              type="date"
              value={fechaHora ? fechaHora.toISOString().slice(0, 10) : ""}
              onChange={(e) => {
                const fecha = new Date(e.target.value);
                if (fechaHora) {
                  fecha.setHours(fechaHora.getHours(), fechaHora.getMinutes());
                }
                setFechaHora(fecha);
              }}
              required
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="mt-4">
            <label className="text-lg font-medium text-gray-800 dark:text-gray-100">Hora</label>
            <input
              type="time"
              value={
                fechaHora
                  ? `${fechaHora
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${fechaHora
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : ""
              }
              onChange={(e) => {
                const [hours, minutes] = e.target.value
                  .split(":")
                  .map(Number);
                const base = fechaHora ? new Date(fechaHora) : new Date();
                base.setHours(hours, minutes);
                setFechaHora(base);
              }}
              required
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="mt-8 flex flex-col">
            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer text-white font-semibold py-3 rounded-xl text-lg transition ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {loading
                ? (id ? "Actualizando..." : "Creando evento...")
                : (id ? "Actualizar evento" : "Guardar evento")
              }
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

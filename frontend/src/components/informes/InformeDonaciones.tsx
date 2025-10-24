import { useEffect, useState } from "react";
import { Header } from "../Header";
import {
  obtenerInformeDonaciones,
  descargarExcelDonaciones,
  type DonacionAgrupada,
  type FiltrosDonaciones,
} from "../../services/informesApi";

const categorias = ["ROPA", "ALIMENTOS", "JUGUETES", "UTILES_ESCOLARES"] as const;

export const InformeDonaciones = () => {
  const [donaciones, setDonaciones] = useState<DonacionAgrupada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [descargando, setDescargando] = useState(false);

  // Filtros
  const [categoria, setCategoria] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [eliminado, setEliminado] = useState<string>("TODOS"); // TODOS | SI | NO

  const cargarInforme = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros: FiltrosDonaciones = {};
      if (categoria) filtros.categoria = categoria;
      if (fechaDesde) {
        // Formato: "2025-01-15T00:00:00" (sin zona horaria)
        filtros.fechaDesde = fechaDesde + "T00:00:00";
      }
      if (fechaHasta) {
        // Formato: "2025-01-15T23:59:59" (sin zona horaria)
        filtros.fechaHasta = fechaHasta + "T23:59:59";
      }
      if (eliminado === "SI") filtros.eliminado = true;
      if (eliminado === "NO") filtros.eliminado = false;

      console.log("[INFORME] Filtros a enviar:", filtros);
      const data = await obtenerInformeDonaciones(filtros);
      setDonaciones(data);
    } catch (e: any) {
      console.error("[INFORME] Error:", e);
      setError(e?.message || "Error al cargar el informe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarInforme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuscar = () => {
    void cargarInforme();
  };

  const handleLimpiar = () => {
    setCategoria("");
    setFechaDesde("");
    setFechaHasta("");
    setEliminado("TODOS");
  };

  const handleDescargarExcel = async () => {
    try {
      setDescargando(true);

      const filtros: FiltrosDonaciones = {};
      if (categoria) filtros.categoria = categoria;
      if (fechaDesde) {
        const fecha = new Date(fechaDesde + "T00:00:00");
        filtros.fechaDesde = fecha.toISOString();
      }
      if (fechaHasta) {
        const fecha = new Date(fechaHasta + "T23:59:59");
        filtros.fechaHasta = fecha.toISOString();
      }
      if (eliminado === "SI") filtros.eliminado = true;
      if (eliminado === "NO") filtros.eliminado = false;

      await descargarExcelDonaciones(filtros);
      alert("✅ Descarga iniciada");
    } catch (e: any) {
      alert(e?.message || "Error al descargar Excel");
    } finally {
      setDescargando(false);
    }
  };

  const nombreCategoria = (cat: string) => {
    const map: Record<string, string> = {
      ROPA: "Ropa",
      ALIMENTOS: "Alimentos",
      JUGUETES: "Juguetes",
      UTILES_ESCOLARES: "Útiles Escolares",
    };
    return map[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="p-5 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Informe de Donaciones
        </h1>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Filtros
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Categoría:
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {nombreCategoria(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Fecha Desde:
              </label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Fecha Hasta:
              </label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Eliminado:
              </label>
              <select
                value={eliminado}
                onChange={(e) => setEliminado(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TODOS">Todos</option>
                <option value="SI">Sí</option>
                <option value="NO">No</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleBuscar}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              🔍 Buscar
            </button>
            <button
              onClick={handleLimpiar}
              className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
            >
              🧹 Limpiar
            </button>
            <button
              onClick={handleDescargarExcel}
              disabled={descargando}
              className={`px-5 py-2 font-medium rounded-md transition-colors ${
                descargando
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {descargando ? "⏳ Descargando..." : "📥 Descargar Excel"}
            </button>
          </div>
        </div>

        {/* Resultados */}
        {loading && (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Cargando informe...
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 dark:text-red-400">
            ❌ {error}
          </p>
        )}

        {!loading && !error && donaciones.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-10">
            No hay donaciones que mostrar con los filtros seleccionados.
          </p>
        )}

        {!loading && !error && donaciones.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Resultados (agrupados por categoría y estado)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-4 py-3 text-left border border-gray-300 dark:border-gray-600">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-center border border-gray-300 dark:border-gray-600">
                      Eliminado
                    </th>
                    <th className="px-4 py-3 text-right border border-gray-300 dark:border-gray-600">
                      Total Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {donaciones.map((d, idx) => (
                    <tr
                      key={idx}
                      className={
                        idx % 2 === 0
                          ? "bg-gray-50 dark:bg-gray-700"
                          : "bg-white dark:bg-gray-800"
                      }
                    >
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                        {nombreCategoria(d.categoria)}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-center">
                        {d.eliminado ? (
                          <span className="text-red-600 dark:text-red-400 font-bold">
                            ✖ Sí
                          </span>
                        ) : (
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            ✔ No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-right font-bold text-gray-900 dark:text-gray-100">
                        {d.totalCantidad}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

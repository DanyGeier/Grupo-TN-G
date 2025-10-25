import { useEffect, useState } from "react";
import { Header } from "../Header";
import { useUser } from "../../context/UserContext";
import {
  obtenerInformeDonaciones,
  descargarExcelDonaciones,
  listarFiltrosDonacion,
  guardarFiltroDonacion,
  actualizarFiltroDonacion,
  eliminarFiltroDonacion,
  type DonacionAgrupada,
  type FiltrosDonaciones,
  type FiltroDonacion,
} from "../../services/informesApi";

const categorias = ["ROPA", "ALIMENTOS", "JUGUETES", "UTILES_ESCOLARES"] as const;

export const InformeDonaciones = () => {
  const { usuario } = useUser();
  const [donaciones, setDonaciones] = useState<DonacionAgrupada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [descargando, setDescargando] = useState(false);

  // Filtros
  const [categoria, setCategoria] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [eliminado, setEliminado] = useState<string>("TODOS"); // TODOS | SI | NO

  // Filtros personalizados
  const [filtrosGuardados, setFiltrosGuardados] = useState<FiltroDonacion[]>([]);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<string | null>(null);
  const [mostrarModalNombre, setMostrarModalNombre] = useState(false);
  const [nombreNuevoFiltro, setNombreNuevoFiltro] = useState("");
  const [editandoFiltro, setEditandoFiltro] = useState(false);

  const cargarInforme = async (filtrosPersonalizados?: {
    categoria?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    eliminado?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Usar filtros personalizados si se proporcionan, sino usar los del estado
      const cat = filtrosPersonalizados?.categoria !== undefined ? filtrosPersonalizados.categoria : categoria;
      const fd = filtrosPersonalizados?.fechaDesde !== undefined ? filtrosPersonalizados.fechaDesde : fechaDesde;
      const fh = filtrosPersonalizados?.fechaHasta !== undefined ? filtrosPersonalizados.fechaHasta : fechaHasta;
      const elim = filtrosPersonalizados?.eliminado !== undefined ? filtrosPersonalizados.eliminado : eliminado;

      const filtros: FiltrosDonaciones = {};
      if (cat) filtros.categoria = cat;
      if (fd) {
        filtros.fechaDesde = fd + "T00:00:00";
      }
      if (fh) {
        filtros.fechaHasta = fh + "T23:59:59";
      }
      if (elim === "SI") filtros.eliminado = true;
      if (elim === "NO") filtros.eliminado = false;

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

  const cargarFiltrosGuardados = async () => {
    if (!usuario?.id) return;

    try {
      const filtros = await listarFiltrosDonacion(usuario.id);
      setFiltrosGuardados(filtros);
    } catch (e: any) {
      console.error("[FILTROS] Error al cargar filtros:", e);
    }
  };

  useEffect(() => {
    void cargarInforme();
    void cargarFiltrosGuardados();
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
    setFiltroSeleccionado(null);
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

  const handleGuardarFiltro = () => {
    if (!usuario?.id) {
      alert("❌ No hay usuario logueado");
      return;
    }
    setEditandoFiltro(false);
    setMostrarModalNombre(true);
  };

  const handleActualizarFiltro = () => {
    if (!filtroSeleccionado) {
      alert("❌ Selecciona un filtro para actualizar");
      return;
    }
    if (!usuario?.id) {
      alert("❌ No hay usuario logueado");
      return;
    }
    setEditandoFiltro(true);
    setMostrarModalNombre(true);
    const filtro = filtrosGuardados.find(f => f.id === filtroSeleccionado);
    if (filtro) {
      setNombreNuevoFiltro(filtro.nombreFiltro);
    }
  };

  const handleConfirmarGuardarFiltro = async () => {
    if (!nombreNuevoFiltro.trim()) {
      alert("❌ Ingresa un nombre para el filtro");
      return;
    }
    if (!usuario?.id) {
      alert("❌ No hay usuario logueado");
      return;
    }

    try {
      const filtros: FiltrosDonaciones = {};
      if (categoria) filtros.categoria = categoria;
      if (fechaDesde) filtros.fechaDesde = fechaDesde + "T00:00:00";
      if (fechaHasta) filtros.fechaHasta = fechaHasta + "T23:59:59";
      if (eliminado === "SI") filtros.eliminado = true;
      if (eliminado === "NO") filtros.eliminado = false;

      if (editandoFiltro && filtroSeleccionado) {
        await actualizarFiltroDonacion(filtroSeleccionado, usuario.id, nombreNuevoFiltro, filtros);
        alert("✅ Filtro actualizado correctamente");
      } else {
        await guardarFiltroDonacion(usuario.id, nombreNuevoFiltro, filtros);
        alert("✅ Filtro guardado correctamente");
      }

      setMostrarModalNombre(false);
      setNombreNuevoFiltro("");
      setEditandoFiltro(false);
      await cargarFiltrosGuardados();
    } catch (e: any) {
      alert(e?.message || "Error al guardar filtro");
    }
  };

  const handleCargarFiltro = async () => {
    console.log("🔍 [DEBUG] handleCargarFiltro iniciado");
    console.log("🔍 [DEBUG] filtroSeleccionado:", filtroSeleccionado);
    console.log("🔍 [DEBUG] filtrosGuardados:", filtrosGuardados);

    if (!filtroSeleccionado) {
      alert("❌ Selecciona un filtro");
      return;
    }

    const filtro = filtrosGuardados.find(f => f.id === filtroSeleccionado);
    console.log("🔍 [DEBUG] filtro encontrado:", filtro);

    if (!filtro) {
      console.error("❌ [DEBUG] No se encontró el filtro con ID:", filtroSeleccionado);
      alert("❌ Error: Filtro no encontrado. Intenta recargar la página.");
      return;
    }

    try {
      // Preparar valores del filtro guardado
      const catFiltro = filtro.categoria || "";
      const fdFiltro = filtro.fechaDesde ? filtro.fechaDesde.split('T')[0] : "";
      const fhFiltro = filtro.fechaHasta ? filtro.fechaHasta.split('T')[0] : "";
      let elimFiltro = "TODOS";
      if (filtro.eliminado === true) elimFiltro = "SI";
      else if (filtro.eliminado === false) elimFiltro = "NO";

      console.log("🔍 [DEBUG] Valores preparados:", { catFiltro, fdFiltro, fhFiltro, elimFiltro });

      // Actualizar los estados de los filtros
      setCategoria(catFiltro);
      setFechaDesde(fdFiltro);
      setFechaHasta(fhFiltro);
      setEliminado(elimFiltro);

      console.log("🔍 [DEBUG] Llamando a cargarInforme con filtros");

      // Ejecutar búsqueda con los filtros guardados
      await cargarInforme({
        categoria: catFiltro,
        fechaDesde: fdFiltro,
        fechaHasta: fhFiltro,
        eliminado: elimFiltro
      });

      console.log("✅ [DEBUG] cargarInforme completado");
    } catch (error) {
      console.error("❌ [DEBUG] Error en handleCargarFiltro:", error);
      alert("Error al cargar el filtro: " + (error as Error).message);
    }
  };

  const handleEliminarFiltro = async () => {
    if (!filtroSeleccionado) {
      alert("❌ Selecciona un filtro para eliminar");
      return;
    }
    if (!usuario?.id) {
      alert("❌ No hay usuario logueado");
      return;
    }

    if (!confirm("¿Estás seguro de eliminar este filtro?")) return;

    try {
      await eliminarFiltroDonacion(filtroSeleccionado, usuario.id);
      alert("✅ Filtro eliminado correctamente");
      setFiltroSeleccionado(null);
      await cargarFiltrosGuardados();
    } catch (e: any) {
      alert(e?.message || "Error al eliminar filtro");
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

        {/* Filtros Guardados */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Filtros Guardados
          </h3>
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={filtroSeleccionado || ""}
              onChange={(e) => setFiltroSeleccionado(e.target.value || null)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar filtro...</option>
              {filtrosGuardados.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombreFiltro}
                </option>
              ))}
            </select>
            <button
              onClick={handleCargarFiltro}
              disabled={!filtroSeleccionado}
              className={`px-4 py-2 font-medium rounded-md transition-colors ${filtroSeleccionado
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-400 cursor-not-allowed text-white"
                }`}
            >
              📂 Cargar
            </button>
            <button
              onClick={handleGuardarFiltro}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            >
              💾 Guardar como nuevo
            </button>
            <button
              onClick={handleActualizarFiltro}
              disabled={!filtroSeleccionado}
              className={`px-4 py-2 font-medium rounded-md transition-colors ${filtroSeleccionado
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-gray-400 cursor-not-allowed text-white"
                }`}
            >
              ✏️ Actualizar
            </button>
            <button
              onClick={handleEliminarFiltro}
              disabled={!filtroSeleccionado}
              className={`px-4 py-2 font-medium rounded-md transition-colors ${filtroSeleccionado
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-400 cursor-not-allowed text-white"
                }`}
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>

        {/* Modal para nombre de filtro */}
        {mostrarModalNombre && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                {editandoFiltro ? "Actualizar Filtro" : "Guardar Filtro"}
              </h3>
              <input
                type="text"
                value={nombreNuevoFiltro}
                onChange={(e) => setNombreNuevoFiltro(e.target.value)}
                placeholder="Nombre del filtro..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmarGuardarFiltro}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setMostrarModalNombre(false);
                    setNombreNuevoFiltro("");
                    setEditandoFiltro(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

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
              className={`px-5 py-2 font-medium rounded-md transition-colors ${descargando
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

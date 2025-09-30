import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../context/UserContext";
import {
  listarInventario,
  crearItem,
  actualizarItem,
  bajaLogicaItem,
  type InventarioItemApi,
  nombreCategoria,
} from "../../services/inventarioApi";
import { Header } from "../Header";

const categorias = ["ROPA", "ALIMENTOS", "JUGUETES", "UTILES_ESCOLARES"] as const;

type CategoriaString = typeof categorias[number];

type Filtro = "TODOS" | "ACTIVOS" | "ELIMINADOS";

export const InventarioLista = () => {
  const { token, usuario } = useUser();
  const [items, setItems] = useState<InventarioItemApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtro, setFiltro] = useState<Filtro>("TODOS");

  // Form de alta
  const [catNueva, setCatNueva] = useState<CategoriaString>("ROPA");
  const [descNueva, setDescNueva] = useState("");
  const [cantNueva, setCantNueva] = useState<number>(0);

  const puedeGestionar = useMemo(() => usuario && (usuario.rol === 0 || usuario.rol === 1), [usuario]);
  const colSpan = puedeGestionar ? 5 : 4; // ID oculto; columnas visibles sin acciones=4, con acciones=5

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await listarInventario(token);
      setItems(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "No se pudo cargar el inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemsFiltrados = useMemo(() => {
    if (filtro === "ACTIVOS") return items.filter((i) => !i.eliminado);
    if (filtro === "ELIMINADOS") return items.filter((i) => i.eliminado);
    return items;
  }, [items, filtro]);

  const onCrear = async () => {
    if (!puedeGestionar) return;
    if (cantNueva < 0) {
      alert("La cantidad no puede ser negativa");
      return;
    }
    try {
      const creado = await crearItem(token, catNueva, descNueva, cantNueva);
      setItems((prev) => [creado, ...prev]);
      setDescNueva("");
      setCantNueva(0);
      alert("Ítem creado ✅");
    } catch (e: any) {
      alert(e?.message || "Error al crear ítem");
    }
  };

  const onEditar = async (it: InventarioItemApi) => {
    if (!puedeGestionar) return;
    const nuevaDesc = prompt("Nueva descripción", it.descripcion ?? "") ?? it.descripcion;
    const nuevaCantStr = prompt("Nueva cantidad", String(it.cantidad));
    if (nuevaCantStr == null) return;
    const nuevaCant = Number(nuevaCantStr);
    if (!Number.isFinite(nuevaCant) || nuevaCant < 0) {
      alert("Cantidad inválida");
      return;
    }
    try {
      const act = await actualizarItem(token, it.id, nuevaDesc ?? "", nuevaCant);
      setItems((prev) => prev.map((x) => (x.id === it.id ? act : x)));
      alert("Ítem actualizado ✅");
    } catch (e: any) {
      alert(e?.message || "Error al actualizar ítem");
    }
  };

  const onBaja = async (it: InventarioItemApi) => {
    if (!puedeGestionar) return;
    if (!confirm("¿Dar de baja lógica este ítem?")) return;
    try {
      await bajaLogicaItem(token, it.id);
      setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, eliminado: true } : x)));
      alert("Ítem dado de baja ✅");
    } catch (e: any) {
      alert(e?.message || "Error al dar de baja ítem");
    }
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold mb-0 text-gray-800 dark:text-gray-100">Inventario</h2>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as Filtro)}
            className="border rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVOS">Activos</option>
            <option value="ELIMINADOS">Eliminados</option>
          </select>
        </div>
        {error && <div className="text-red-600 dark:text-red-300 mb-4">{error}</div>}

        {puedeGestionar && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">Categoría</label>
              <select
                className="border rounded w-full p-2 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                value={catNueva}
                onChange={(e) => setCatNueva(e.target.value as CategoriaString)}
              >
                {categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">Descripción</label>
              <input
                className="border rounded w-full p-2 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                value={descNueva}
                onChange={(e) => setDescNueva(e.target.value)}
                placeholder="remeras"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">Cantidad</label>
              <input
                type="number"
                className="border rounded w-full p-2 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                value={cantNueva}
                onChange={(e) => setCantNueva(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={onCrear}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Agregar
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <table className="w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {/* ID oculto según requerimiento */}
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Categoría</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Descripción</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Cantidad</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Eliminado</th>
                {puedeGestionar && (
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100" colSpan={colSpan}>Cargando...</td>
                </tr>
              ) : itemsFiltrados.length === 0 ? (
                <tr>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100" colSpan={colSpan}>Sin ítems</td>
                </tr>
              ) : (
                itemsFiltrados.map((it) => (
                  <tr key={it.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {/* ID oculto */}
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{nombreCategoria(it.categoria as any)}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{it.descripcion}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{it.cantidad}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{it.eliminado ? "Sí" : "No"}</td>
                    {puedeGestionar && (
                      <td className="px-4 py-3 space-x-3">
                        <button
                          onClick={() => onEditar(it)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onBaja(it)}
                          className="text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-400 disabled:opacity-50"
                          disabled={it.eliminado}
                        >
                          Baja
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

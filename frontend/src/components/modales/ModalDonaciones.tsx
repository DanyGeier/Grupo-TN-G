import { useEffect, useState } from "react";
import type { InventarioItemDto } from "../../models/dto/inventarioItemDto";
import { eventosApiService, type InventarioActivoItemApi } from "../../services/eventosApi";

interface Props {
  open: boolean;
  onClose: () => void;
  eventoId: string;
  donaciones: InventarioItemDto[];
  puedeAgregar?: boolean;
}

export const ModalDonaciones = ({
  open,
  onClose,
  eventoId,
  donaciones,
  puedeAgregar = false,
}: Props) => {
  const [invItems, setInvItems] = useState<InventarioActivoItemApi[]>([]);
  const [selectedId, setSelectedId] = useState<number | "">("");
  const selectedItem = invItems.find((i) => i.id === selectedId);
  const [cantidad, setCantidad] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInv, setLoadingInv] = useState(false);

  useEffect(() => {
    if (!open || !puedeAgregar) return;
    const load = async () => {
      try {
        setLoadingInv(true);
        const data = await eventosApiService.listarInventarioActivo();
        // Sólo con stock > 0
        setInvItems(data.filter((d) => d.cantidad > 0));
        setSelectedId("");
        setCantidad(0);
        setError(null);
      } catch (e: any) {
        setError(e?.message || "No se pudo cargar el inventario activo");
      } finally {
        setLoadingInv(false);
      }
    };
    void load();
  }, [open, puedeAgregar]);

  if (!open) return null;

  const handleAgregar = async () => {
    if (!selectedItem) {
      setError("Selecciona un ítem de inventario");
      return;
    }
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }
    if (cantidad > selectedItem.cantidad) {
      setError("Cantidad supera el stock disponible");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await eventosApiService.registrarDonacion(eventoId, {
        categoria: selectedItem.categoria,
        descripcion: selectedItem.descripcion,
        cantidad,
      });
      onClose();
      alert("Donación registrada ✅");
    } catch (err: any) {
      setError(err?.message || "Error al registrar donación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl p-6 w-[700px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Donaciones del Evento</h2>

        {donaciones.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 text-gray-700 dark:text-gray-200">Nombre</th>
                <th className="py-2 text-gray-700 dark:text-gray-200">Categoría</th>
                <th className="py-2 text-gray-700 dark:text-gray-200">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {donaciones.map((d, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/60">
                  <td className="py-2">{d.nombre}</td>
                  <td className="py-2">{d.categoria}</td>
                  <td className="py-2">{d.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No hay donaciones registradas</p>
        )}

        {puedeAgregar && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="font-semibold mb-2">Agregar donación del inventario</h3>
            {loadingInv && <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Cargando inventario...</div>}
            {error && <div className="text-red-600 dark:text-red-300 mb-2">{error}</div>}

            <div className="grid grid-cols-3 gap-3 items-end">
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Ítem (categoría – descripción – stock)
                </label>
                <select
                  className="border p-2 rounded w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : "")}
                  disabled={loadingInv}
                >
                  <option value="">Selecciona un ítem</option>
                  {invItems.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.categoria} – {it.descripcion} – stock: {it.cantidad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Cantidad</label>
                <input
                  className="border p-2 rounded w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                  type="number"
                  min={1}
                  max={selectedItem?.cantidad ?? undefined}
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  disabled={!selectedItem}
                />
                {selectedItem && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Máx: {selectedItem.cantidad}</div>
                )}
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                disabled={loading || !selectedItem}
                onClick={handleAgregar}
                className={`px-4 py-2 rounded text-white ${
                  loading || !selectedItem
                    ? "bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Guardando..." : "Agregar"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

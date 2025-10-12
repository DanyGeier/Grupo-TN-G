import { useState } from "react";
import type { DonacionItem } from "../../models/donaciones/donacionItem";
import type { Donacion } from "../../models/donaciones/donacion";
import type { OfertaDonacion } from "../../models/donaciones/ofertaDonacion";
import { Header } from "../Header";

export const FormOfrecerDonaciones = () => {
  const [idOrganizacion, setIdOrganizacion] = useState<number>(0);
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agregarDonacion = () => {
    setDonaciones([
      ...donaciones,
      { donacionItem: { categoria: "", descripcion: "" }, cantidad: 1, id: 0 },
    ]);
  };

  const actualizarDonacion = (
    index: number,
    field: keyof DonacionItem | "cantidad",
    value: any
  ) => {
    const nuevaLista = [...donaciones];
    if (field === "cantidad") {
      nuevaLista[index].cantidad = Number(value);
    } else {
      nuevaLista[index].donacionItem = {
        ...nuevaLista[index].donacionItem,
        [field]: value,
      };
    }
    setDonaciones(nuevaLista);
  };

  const eliminarDonacion = (index: number) => {
    setDonaciones(donaciones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idOrganizacion || donaciones.length === 0) {
      setError("Completa todos los campos antes de enviar");
      return;
    }

    setLoading(true);
    const oferta: OfertaDonacion = {
      idOrganizacionSolicitante: idOrganizacion,
      donaciones,
      idOferta: 0,
    };
    console.log("Oferta enviada:", oferta);
    setLoading(false);
    setError(null);
  };

  return (
    <>
      <Header></Header>
      <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-10 bg-gray-100 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Ofrecer Donaciones
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 border border-red-400 px-4 py-2 rounded mb-4 w-full max-w-xl">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-xl space-y-4"
        >
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              ID Organización:
            </label>
            <input
              type="number"
              value={idOrganizacion}
              onChange={(e) => setIdOrganizacion(Number(e.target.value))}
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="Ingrese el ID de la organización"
            />
          </div>

          <div>
            <h4 className="text-gray-800 dark:text-gray-100 font-medium mb-2">
              Donaciones
            </h4>
            {donaciones.map((d, i) => (
              <div
                key={i}
                className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-4 space-y-2"
              >
                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">
                  Categoria
                </label>
                <input
                  type="text"
                  placeholder="Ropa"
                  value={d.donacionItem.categoria}
                  onChange={(e) =>
                    actualizarDonacion(i, "categoria", e.target.value)
                  }
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
                />

                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">
                  Descripcion
                </label>
                <input
                  type="text"
                  placeholder="Remeras"
                  value={d.donacionItem.descripcion}
                  onChange={(e) =>
                    actualizarDonacion(i, "descripcion", e.target.value)
                  }
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
                />

                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">
                  Cantidad
                </label>
                <input
                  type="number"
                  placeholder="10"
                  value={d.cantidad}
                  min={1}
                  onChange={(e) =>
                    actualizarDonacion(i, "cantidad", e.target.value)
                  }
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => eliminarDonacion(i)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mt-2"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={agregarDonacion}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Agregar Donación
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Enviando..." : "Enviar Oferta"}
          </button>
        </form>
      </div>
    </>
  );
};

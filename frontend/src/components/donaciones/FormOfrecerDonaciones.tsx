import { useState } from "react";
import type {  OfertaDonacionPost } from "../../models/donaciones/ofertaDonacion";
import { Header } from "../Header";
import type { Donacion } from "../../models/donaciones/donacion";
import { ofrecerDonacion } from "../../services/donacionApi";

export const FormOfrecerDonaciones = () => {

  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categorias = ["ROPA", "ALIMENTOS", "JUGUETES", "UTILES_ESCOLARES"] as const;
  type CategoriaString = typeof categorias[number];


  const agregarDonacion = () => {
    setDonaciones([
      ...donaciones,
      { id: 0, categoria: "ROPA", descripcion: "", cantidad: 1 },
    ]);
  };

  // Actualiza una propiedad específica de una donación
const actualizarDonacion = (index: number, field: keyof Donacion, value: string | number) => {
  const copiaLista: Donacion[] = [...donaciones]; 
  if (field === "cantidad") {
    copiaLista[index].cantidad = Number(value);
  } else {
    // Forzamos que value sea string para las demás propiedades
    (copiaLista[index][field] as string) = String(value);
  }
  setDonaciones(copiaLista);
};



  const eliminarDonacion = (index: number) => {
    setDonaciones(donaciones.filter((_, i) => i !== index));
  };

  // Envía la oferta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const oferta: OfertaDonacionPost = {
      donaciones: donaciones,
    };

    try {
      const respuesta = await ofrecerDonacion(oferta);
      console.log("Oferta enviada con éxito:", respuesta);
      alert("Oferta enviada correctamente ✅");
    } catch (err: any) {
      setError(err.message || "Error al enviar la oferta");
    } finally {
      setLoading(false);
    }
 
  };

  return (
    <>
      <Header />
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


          {/* DONACIONES */}
          <div>
            <h4 className="text-gray-800 dark:text-gray-100 font-medium mb-2">
              Donaciones
            </h4>

            {donaciones.map((d, i) => (
              <div
                key={i}
                className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-4 space-y-2"
              >
                {/* CATEGORÍA */}
                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">
                  Categoría
                </label>
                <select
                  value={d.categoria}
                  onChange={(e) =>
                    actualizarDonacion(i, "categoria", e.target.value as CategoriaString)
                  }
                  className="border rounded w-full p-2 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                >
                  {categorias.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* DESCRIPCIÓN */}
                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">
                  Descripción
                </label>
                <input
                  type="text"
                  placeholder="Ej: Remeras, pantalones, etc."
                  value={d.descripcion}
                  onChange={(e) => actualizarDonacion(i, "descripcion", e.target.value)}
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
                />

                {/* CANTIDAD */}
                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">
                  Cantidad
                </label>
                <input
                  type="number"
                  min={1}
                  value={d.cantidad}
                  onChange={(e) => actualizarDonacion(i, "cantidad", e.target.value)}
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
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Enviando..." : "Enviar Oferta"}
          </button>
        </form>
      </div>
    </>
  );
};

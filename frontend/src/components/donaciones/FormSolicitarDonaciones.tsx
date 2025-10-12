import { useState } from "react";
import type { Donacion } from "../../models/donaciones/donacion";
import type { SolicitudDonacionPost } from "../../models/donaciones/solicitudDonacion";
import { Header } from "../Header";
import { publicarSolicitudDonacion } from "../../services/donacionApi";

export const FormSolicitarDonaciones = () => {
  const [formData, setFormData] = useState<SolicitudDonacionPost>({
    donaciones: [{ categoria: "ROPA", descripcion: ""}],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categorias = ["ROPA", "ALIMENTOS", "JUGUETES", "UTILES_ESCOLARES"] as const;
  type CategoriaString = typeof categorias[number];

  const handleDonacionChange = (index: number, field: keyof Donacion, value: string | number) => {
    setFormData((prev) => {
      const nuevasDonaciones = [...prev.donaciones];
      nuevasDonaciones[index] = {
        ...nuevasDonaciones[index],
        [field]: field === "cantidad" ? Number(value) : String(value),
      };
      return { ...prev, donaciones: nuevasDonaciones };
    });
  };

  const agregarDonacion = () => {
    setFormData((prev) => ({
      ...prev,
      donaciones: [...prev.donaciones, { categoria: "ROPA", descripcion: "" }],
    }));
  };

  const eliminarDonacion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      donaciones: prev.donaciones.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.donaciones.length === 0) {
      setError("Completa todos los campos antes de enviar");
      return;
    }

    setLoading(true);
    setError(null);

    try {
            console.log("Solicitud enviada:", formData);

      const respuesta = await publicarSolicitudDonacion(formData);
      
      console.log("Solicitud enviada:", respuesta);
      alert("Solicitud enviada correctamente ✅");
      setFormData({ donaciones: [{ categoria: "ROPA", descripcion: ""}] });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
      
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-10 bg-gray-100 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Solicitar Donaciones
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 border border-red-400 px-4 py-2 rounded mb-4 w-full max-w-lg">
            {error}
          </div>
        )}

        <form
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-lg space-y-4"
          onSubmit={handleSubmit}
        >
          {/* DONACIONES */}
          <div>
            <h4 className="text-gray-800 dark:text-gray-100 font-medium mb-2">
              Listado de Solicitudes de Donaciones
            </h4>
            {formData.donaciones.map((donacion, index) => (
              <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-4 space-y-2">
                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">Categoría</label>
                <select
                  value={donacion.categoria}
                  onChange={(e) => handleDonacionChange(index, "categoria", e.target.value as CategoriaString)}
                  className="border rounded w-full p-2 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                >
                  {categorias.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">Descripción</label>
                <input
                  type="text"
                  value={donacion.descripcion}
                  onChange={(e) => handleDonacionChange(index, "descripcion", e.target.value)}
                  placeholder="Ej: Remeras, pantalones, etc."
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
                  required
                />

   

                {formData.donaciones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarDonacion(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mt-2"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={agregarDonacion}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
              + Agregar otra solicitud de donación
            </button>
          </div>

          {/* BOTÓN ENVIAR */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Enviando..." : "Enviar Solicitud"}
          </button>
        </form>
      </div>
    </>
  );
};

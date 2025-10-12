import { useState } from "react";
import type { DonacionItem } from "../../models/donaciones/donacionItem";
import type { SolicitudDonacion } from "../../models/donaciones/solicitudDonacion";
import { Header } from "../Header";

export const FormSolicitarDonaciones = () => {
  const [formData, setFormData] = useState<SolicitudDonacion>({
    idOrganizacionSolicitante: 0,
    idSolicitud: 0,
    donaciones: [{ categoria: "", descripcion: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDonacionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const nuevasDonaciones: DonacionItem[] = [...formData.donaciones];
    nuevasDonaciones[index][name as keyof DonacionItem] = value;
    setFormData({ ...formData, donaciones: nuevasDonaciones });
  };

  const agregarDonacion = () => {
    setFormData({
      ...formData,
      donaciones: [...formData.donaciones, { categoria: "", descripcion: "" }],
    });
  };

  const eliminarDonacion = (index: number) => {
    const nuevasDonaciones = formData.donaciones.filter((_, i) => i !== index);
    setFormData({ ...formData, donaciones: nuevasDonaciones });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.idOrganizacionSolicitante ||
      formData.donaciones.length === 0
    ) {
      setError("Completa todos los campos antes de enviar");
      return;
    }
    setLoading(true);
    console.log("Solicitud enviada:", formData);
    setLoading(false);
    setError(null);
  };

  return (
    <>
      <Header></Header>
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
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              ID Organización Solicitante
            </label>
            <input
              type="number"
              value={formData.idOrganizacionSolicitante}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  idOrganizacionSolicitante: Number(e.target.value),
                })
              }
              required
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <h4 className="text-gray-800 dark:text-gray-100 font-medium mb-2">
              Listado de Solicitudes de Donaciones
            </h4>
            {formData.donaciones.map((donacion, index) => (
              <div
                key={index}
                className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-4 space-y-2"
              >
                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">
                  Categoria
                </label>
                <input
                  type="text"
                  name="categoria"
                  placeholder="Ropa"
                  value={donacion.categoria}
                  onChange={(e) => handleDonacionChange(index, e)}
                  required
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
                />
                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">
                  Descripcion
                </label>
                <input
                  type="text"
                  name="descripcion"
                  placeholder="Remeras"
                  value={donacion.descripcion}
                  onChange={(e) => handleDonacionChange(index, e)}
                  required
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Enviando..." : "Enviar Solicitud"}
          </button>
        </form>
      </div>
    </>
  );
};

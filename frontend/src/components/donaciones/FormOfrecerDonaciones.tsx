import { useState } from "react";
import { Header } from "../Header";
import { ofrecerDonacion } from "../../services/donacionApi";
import type { OfertaDonacionDto, DetalleOferta } from "../../models/donaciones/ofertaDonacion";

export const FormOfrecerDonaciones = () => {
const [oferta, setOferta] = useState<OfertaDonacionDto>({
  donacionesOfrecidas: [{ categoria: "ROPA", descripcion: "", cantidad: 1 }]
});  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categorias = ["ROPA", "ALIMENTOS", "JUGUETES", "UTILES_ESCOLARES"] as const;
  type CategoriaString = typeof categorias[number];

  // Agregar una nueva donación
  const agregarDonacion = () => {
    setOferta({
      donacionesOfrecidas: [
        ...oferta.donacionesOfrecidas,
        { categoria: "ROPA", descripcion: "", cantidad: 1 },
      ],
    });
  };

  // Actualizar un campo de la donación
  const actualizarDonacion = (index: number, field: keyof DetalleOferta, value: string | number) => {
    setOferta({
      donacionesOfrecidas: oferta.donacionesOfrecidas.map((d, i) =>
        i === index
          ? { ...d, [field]: field === "cantidad" ? Number(value) : value }
          : d
      ),
    });
  };

  // Eliminar donación
  const eliminarDonacion = (index: number) => {
    const copia = oferta.donacionesOfrecidas.filter((_, i) => i !== index);
    setOferta({ donacionesOfrecidas: copia });
    
  };

  // Validar formulario antes de enviar
  const validarFormulario = () => {
    if (oferta.donacionesOfrecidas.length === 0) {
      throw new Error("Debe agregar al menos una donación");
    }

    // Validar cada donación
    oferta.donacionesOfrecidas.forEach((d, i) => {
      if (!d.descripcion.trim()) {
        throw new Error(`La descripción de la donación ${i + 1} no puede estar vacía`);
      }
      if (d.cantidad < 1) {
        throw new Error(`La cantidad de la donación ${i + 1} debe ser mayor que 0`);
      }
      if (!categorias.includes(d.categoria as CategoriaString)) {
        throw new Error(`Categoría inválida en la donación ${i + 1}`);
      }
    });

    // Validar duplicados (misma descripción + categoría)
    const duplicados = oferta.donacionesOfrecidas.some((item, idx, arr) =>
      arr.findIndex(i => i.descripcion === item.descripcion && i.categoria === item.categoria) !== idx
    );
    if (duplicados) {
      throw new Error("No se pueden repetir items en la oferta");
    }
  };

  // Enviar oferta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      validarFormulario();
      const respuesta = await ofrecerDonacion(oferta);
      console.log("Oferta enviada con éxito:", respuesta);
      alert("Oferta enviada correctamente ✅");
      setOferta({ donacionesOfrecidas: [] }); // limpiar formulario
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
            <h4 className="text-gray-800 dark:text-gray-100 font-medium mb-2">Donaciones</h4>

            {oferta.donacionesOfrecidas.map((d, i) => (
              <div
                key={i}
                className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-4 space-y-2"
              >
                {/* CATEGORÍA */}
                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">Categoría</label>
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
                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Remeras, pantalones, etc."
                  value={d.descripcion}
                  onChange={(e) => actualizarDonacion(i, "descripcion", e.target.value)}
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
                />

                {/* CANTIDAD */}
                <label className="text-gray-700 dark:text-gray-200 mb-1 font-medium">Cantidad</label>
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
               className={`px-3 py-1 rounded mt-2 text-white 
    ${oferta.donacionesOfrecidas.length === 1 
      ? "bg-gray-400 cursor-not-allowed" // apariencia cuando está deshabilitado
      : "bg-red-500 hover:bg-red-600"}`
  }
                   disabled={oferta.donacionesOfrecidas.length === 1} // no permite eliminar si solo queda 1
                >
                  Eliminar
                </button>
              </div>
            ))}

           {oferta.donacionesOfrecidas.length > 0 && (
  <button
    type="button"
    onClick={agregarDonacion}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
  >
    Agregar Donación
  </button>
)}
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

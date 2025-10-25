import React, { useState } from "react";
import { InformeCompletoList } from "./InformeCompletoList";
import type { InformeCompletoDTO } from "./interfaces/interfaces";
import { obtenerInformeCompletoSOAP } from "./api";
import { Header } from "../../Header";

export const InformePage: React.FC = () => {
  const [inputIds, setInputIds] = useState<string>(""); // ids separados por coma
  const [informes, setInformes] = useState<InformeCompletoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConsultar = async () => {
    setError(null);
    setLoading(true);

    try {
      const orgIds = inputIds
        .split(",")
        .map(id => id.trim())
        .filter(id => id !== "")
        .map(id => Number(id))
        .filter(id => !isNaN(id));

      if (orgIds.length === 0) {
        setError("Ingresa al menos un ID válido");
        setLoading(false);
        return;
      }

      const data = await obtenerInformeCompletoSOAP(orgIds);
      setInformes(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener datos");
    } finally {
      setLoading(false);
    }
  };

  return (
          <><Header /><div className="p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Consulta de Presidentes y ONGs</h2>

          <div className="mb-4">
              <label htmlFor="orgIdsInput" className="block text-gray-700 font-medium mb-1">
                  IDs de organizaciones (separados por coma):
              </label>
              <input
                  type="text"
                  id="orgIdsInput"
                  value={inputIds}
                  onChange={e => setInputIds(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 1,2,3" />
          </div>

          <button
              onClick={handleConsultar}
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white font-semibold ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
              {loading ? "Consultando..." : "Consultar"}
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="mt-6">
              <InformeCompletoList informes={informes} />
          </div>
      </div></>
  );
};

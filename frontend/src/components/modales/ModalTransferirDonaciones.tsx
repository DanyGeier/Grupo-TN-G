import React, { useState } from "react";
import type { SolicitudDonacion } from "../../models/donaciones/solicitudDonacion";
import type { TransferenciaDonacionPost } from "../../models/donaciones/transferenciaDonacion";
import { transferirDonacion } from "../../services/donacionApi";

interface Props {
  solicitud: SolicitudDonacion;
  cerrarModal: () => void;
}

export const ModalTransferirDonaciones: React.FC<Props> = ({
  solicitud,
  cerrarModal,
}) => {
  const [cantidades, setCantidades] = useState<number[]>(
    solicitud.donaciones.map(() => 0)
  );
  const [loading, setLoading] = useState(false);

  const handleCantidadChange = (index: number, value: number) => {
    const nuevasCantidades = [...cantidades];
    nuevasCantidades[index] = value;
    setCantidades(nuevasCantidades);
  };

  const handleTransferir = async () => {
    const transferencia: TransferenciaDonacionPost = {
      idSolicitud: solicitud.idSolicitud, 
      donaciones: solicitud.donaciones.map((donacion, index) => ({
        categoria: donacion.categoria,
        descripcion: donacion.descripcion,
        cantidad: cantidades[index],
      })),
    };

    try {
      setLoading(true);
      console.log("Enviando transferencia:", transferencia);
      const response = await transferirDonacion(transferencia);
      console.log("Respuesta del backend:", response);
      alert("Transferencia realizada con éxito ✅");
      cerrarModal();
    } catch (error) {
      console.error("Error al transferir:", error);
      alert("Ocurrió un error al transferir la donación ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Transferir Solicitud {solicitud.idSolicitud}
        </h3>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {solicitud.donaciones.map((donacion, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-200">
                  {donacion.categoria}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {donacion.descripcion}
                </p>
              </div>
              <input
                type="number"
                min={0}
                value={cantidades[index]}
                onChange={(e) =>
                  handleCantidadChange(index, Number(e.target.value))
                }
                className="w-20 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-1 text-center outline-none dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={cerrarModal}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gray-400 hover:bg-gray-500 text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleTransferir}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
          >
            {loading ? "Transfiriendo..." : "Confirmar Transferencia"}
          </button>
        </div>
      </div>
    </div>
  );
};

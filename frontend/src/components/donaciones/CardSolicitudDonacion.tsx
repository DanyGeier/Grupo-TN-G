import React from "react";
import type { SolicitudDonacion } from "../../models/donaciones/solicitudDonacion";

interface Props {
  solicitud: SolicitudDonacion;
  onTransferir?: (solicitud: SolicitudDonacion) => void;
  onDarDeBaja?: (solicitud: SolicitudDonacion) => void;
}

export const CardSolicitudDonacion: React.FC<Props> = ({
  solicitud,
  onTransferir,
  onDarDeBaja,
}) => {
  const esExterna = !!onTransferir;

  const handleClick = () => {
    if (esExterna) {
      onTransferir?.(solicitud);
    } else {
      onDarDeBaja?.(solicitud);
    }
  };

  return (

    
     <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4 hover:shadow-lg transition-all duration-200">
      {esExterna && (
        <p className="text-gray-700 dark:text-gray-200">
          <strong>ID Organización:</strong> {solicitud.idOrganizacionSolicitante}
        </p>
      )}
   
    
      <p className="text-gray-700 dark:text-gray-200">
        <strong>ID Solicitud:</strong> {solicitud.idSolicitud}
      </p>

      <h4 className="text-gray-800 dark:text-gray-100 font-medium">Pedidos:</h4>
      <ul className="space-y-2">
        {solicitud.donaciones.map((donacion, index) => (
          <li
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-900 dark:text-amber-50"
          >
            <span className="font-semibold">{donacion.categoria}:</span>{" "}
            <span>{donacion.descripcion}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        className={`w-full py-2 mt-4 text-white font-semibold rounded-xl transition-colors ${
          esExterna
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {esExterna ? "Transferir" : "Dar de baja"}
      </button>
    </div>
  );
};

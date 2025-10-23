import React, { useEffect, useState } from "react";
import { ModalTransferirDonaciones } from "../modales/ModalTransferirDonaciones";
import { Header } from "../Header";
import { CardSolicitudDonacion } from "./CardSolicitudDonacion";
import type { SolicitudDonacion } from "../../models/donaciones/solicitudDonacion";
import { listarSolicitudesExternas } from "../../services/donacionApi";


export const ListaSolicitudesExternas: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudDonacion[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudDonacion | null>(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const datos = await listarSolicitudesExternas(true); 
        console.log("Solicitudes externas reales:", datos); 
        setSolicitudes(datos);
      } catch (error) {
        console.error("Error al listar solicitudes externas:", error);
      }
    };

    fetchSolicitudes();
  }, []);


  const abrirModal = (solicitud: SolicitudDonacion) => {
    setSolicitudSeleccionada(solicitud);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setSolicitudSeleccionada(null);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Solicitudes de Donaciones de ONGS Externas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solicitudes.map((solicitud) => (
            <CardSolicitudDonacion
              key={solicitud.idSolicitud}
              solicitud={solicitud}
              onTransferir={abrirModal}
            />
          ))}
        </div>

        {modalAbierto && solicitudSeleccionada && (
          <ModalTransferirDonaciones
            solicitud={solicitudSeleccionada}
            cerrarModal={cerrarModal}
          />
        )}
      </div>
    </>
  );
};

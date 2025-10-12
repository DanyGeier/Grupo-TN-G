import React, { useEffect, useState } from "react";
import { ModalTransferirDonaciones } from "../modales/ModalTransferirDonaciones";
import { Header } from "../Header";
import { CardSolicitudDonacion } from "./CardSolicitudDonacion";
import type { SolicitudDonacion } from "../../models/donaciones/solicitudDonacion";
import type { Donacion } from "../../models/donaciones/donacion";

// Datos de prueba
const generarDatosDePrueba = (): SolicitudDonacion[] => {
  const categorias: Donacion["categoria"][] = ["ALIMENTOS", "ROPA", "MEDICAMENTOS", "JUGUETES", "HIGIENE"];
  const descripciones = ["Puré de tomates", "Camisas", "Ibuprofeno", "Pelota de futbol", "Jabón"];

  return Array.from({ length: 10 }, (_, i) => ({
    idOrganizacion: i + 1,
    idSolicitud: 100 + i,
    donaciones: Array.from({ length: 3 }, (_, j) => ({
      id: j + 1,
      categoria: categorias[Math.floor(Math.random() * categorias.length)],
      descripcion: descripciones[Math.floor(Math.random() * descripciones.length)],
      cantidad: Math.floor(Math.random() * 5) + 1, // cantidad aleatoria entre 1 y 5
    })),
  }));
};

export const ListaSolicitudesExternas: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudDonacion[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudDonacion | null>(null);

  useEffect(() => {
    setSolicitudes(generarDatosDePrueba());
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

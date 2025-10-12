// services/donacionesService.ts
import type { OfertaDonacionPost } from "../models/donaciones/ofertaDonacion";
import type {  SolicitudDonacion, SolicitudDonacionPost } from "../models/donaciones/solicitudDonacion";
import type { TransferenciaDonacionPost } from "../models/donaciones/transferenciaDonacion";

const API_URL = "http://localhost:5000/inventario";

// Función para obtener headers con token
const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Publicar una solicitud de donaciones
 */
export const publicarSolicitudDonacion = async (solicitud: SolicitudDonacionPost) => {
  try {
    const response = await fetch(`${API_URL}/solicitar-donaciones`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(solicitud),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Solicitud publicada:", data);
    return data;
  } catch (error) {
    console.error("Error publicando solicitud de donaciones:", error);
    throw error;
  }
};

export const obtenerSolicitudesDonacion = async (): Promise<SolicitudDonacion[]> => {
  try {
    const response = await fetch(`${API_URL}/solicitudes`, {
      method: "GET",
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.solicitudes || [];
  } catch (error) {
    console.error("Error obteniendo solicitudes de donación:", error);
    throw error;
  }
};


/**
 * Ofrecer donaciones
 */
export const ofrecerDonacion = async (oferta: OfertaDonacionPost) => {
  try {
    const response = await fetch(`${API_URL}/oferta`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(oferta),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Oferta enviada:", data);
    return data;
  } catch (error) {
    console.error("Error al enviar la oferta:", error);
    throw error;
  }
};



export const transferirDonacion = async (oferta: TransferenciaDonacionPost) => {
  try {
    const response = await fetch(`${API_URL}/transferir-donacion`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(oferta),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Oferta enviada:", data);
    return data;
  } catch (error) {
    console.error("Error al enviar la oferta:", error);
    throw error;
  }
};

///PENDIENTE: 
//- darBajaSolicitud


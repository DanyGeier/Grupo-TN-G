// services/donacionesService.ts
import type { OfertaDonacionDto } from "../models/donaciones/ofertaDonacion";
import type {  SolicitudDonacion, SolicitudDonacionDto } from "../models/donaciones/solicitudDonacion";
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
export const publicarSolicitudDonacion = async (solicitud: SolicitudDonacionDto) => {
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

export const listarSolicitudesExternas = async (soloActivas = true): Promise<SolicitudDonacion[]> => {
  try {
    const response = await fetch(`${API_URL}/solicitudes-externas?soloActivas=${soloActivas}`, {
      method: "GET",
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.solicitudes;
  } catch (error) {
    console.error("Error listando solicitudes externas:", error);
    throw error;
  }
};


export const ofrecerDonacion = async (oferta: OfertaDonacionDto) => {
  try {
    const response = await fetch(`${API_URL}/ofrecer-donacion`, {
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

export const bajaSolicitudDonacion = async (idSolicitud: string) => {
  try {
    const response = await fetch(`${API_URL}/solicitud/baja`, {
      method: "POST",
      headers: {
        ...authHeaders(),         
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idSolicitud }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Solicitud dada de baja:", data);
    return data;
  } catch (error) {
    console.error("Error al dar de baja la solicitud:", error);
    throw error;
  }
};




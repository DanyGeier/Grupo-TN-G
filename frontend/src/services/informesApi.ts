// Servicio para consumir los endpoints de informes (GraphQL y REST)

const BASE_URL = "http://localhost:5000/informes";

// ==================== GRAPHQL ====================

export interface DonacionAgrupada {
  categoria: string;
  eliminado: boolean;
  totalCantidad: number;
}

export interface InformeDonacionesResponse {
  data: {
    informeDonaciones: {
      donaciones: DonacionAgrupada[];
    };
  };
}

export interface FiltrosDonaciones {
  categoria?: string;
  fechaDesde?: string; // formato ISO
  fechaHasta?: string;
  eliminado?: boolean | null;
}

export const obtenerInformeDonaciones = async (
  filtros?: FiltrosDonaciones
): Promise<DonacionAgrupada[]> => {
  const query = `
    query InformeDonaciones($categoria: String, $fechaDesde: DateTime, $fechaHasta: DateTime, $eliminado: Boolean) {
      informeDonaciones(
        categoria: $categoria
        fechaDesde: $fechaDesde
        fechaHasta: $fechaHasta
        eliminado: $eliminado
      ) {
        donaciones {
          categoria
          eliminado
          totalCantidad
        }
      }
    }
  `;

  // Solo enviar las variables que tienen valores (no undefined/null)
  const variables: any = {};
  if (filtros?.categoria) variables.categoria = filtros.categoria;
  if (filtros?.fechaDesde) variables.fechaDesde = filtros.fechaDesde;
  if (filtros?.fechaHasta) variables.fechaHasta = filtros.fechaHasta;
  if (filtros?.eliminado !== undefined && filtros?.eliminado !== null) {
    variables.eliminado = filtros.eliminado;
  }

  console.log("[GraphQL] Query variables:", variables);

  const response = await fetch(`${BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener informe de donaciones");
  }

  const result = await response.json();
  console.log("GraphQL Response:", result); // Debug: ver qué llega

  // Verificar si hay errores de GraphQL
  if (result.errors && result.errors.length > 0) {
    console.error("GraphQL Errors:", result.errors);
    result.errors.forEach((err: any, idx: number) => {
      console.error(`Error ${idx + 1}:`, err.message, err);
    });
    throw new Error(`Error de GraphQL: ${result.errors[0].message}`);
  }

  // Validar que la respuesta tenga la estructura esperada
  if (!result || !result.data || !result.data.informeDonaciones) {
    console.error("Respuesta inválida:", result);
    throw new Error("Respuesta del servidor inválida");
  }

  return result.data.informeDonaciones.donaciones || [];
};

// ==================== REST ====================

export const descargarExcelDonaciones = async (filtros?: FiltrosDonaciones) => {
  const params = new URLSearchParams();

  if (filtros?.categoria) params.append("categoria", filtros.categoria);
  if (filtros?.fechaDesde) params.append("fechaDesde", filtros.fechaDesde);
  if (filtros?.fechaHasta) params.append("fechaHasta", filtros.fechaHasta);
  if (filtros?.eliminado !== undefined && filtros?.eliminado !== null) {
    params.append("eliminado", String(filtros.eliminado));
  }

  const url = `${BASE_URL}/donaciones/excel?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });

  if (!response.ok) {
    throw new Error("Error al descargar el archivo Excel");
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `informe_donaciones_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

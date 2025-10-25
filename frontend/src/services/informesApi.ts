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

export interface FiltroDonacion {
  id: string;
  nombreFiltro: string;
  usuarioId: string;
  categoria?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  eliminado?: boolean;
  fechaCreacion: string;
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

// ==================== FILTROS PERSONALIZADOS (GRAPHQL) ====================

export const listarFiltrosDonacion = async (usuarioId: number): Promise<FiltroDonacion[]> => {
  // Convertir usuarioId a string para GraphQL
  const usuarioIdStr = String(usuarioId);
  const query = `
    query ListarFiltrosDonacion($usuarioId: ID!) {
      listarFiltrosDonacion(usuarioId: $usuarioId) {
        id
        nombreFiltro
        usuarioId
        categoria
        fechaDesde
        fechaHasta
        eliminado
        fechaCreacion
      }
    }
  `;

  const response = await fetch(`${BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { usuarioId: usuarioIdStr } }),
  });

  if (!response.ok) {
    throw new Error("Error al listar filtros de donaciones");
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(`Error de GraphQL: ${result.errors[0].message}`);
  }

  return result.data.listarFiltrosDonacion || [];
};

export const guardarFiltroDonacion = async (
  usuarioId: number,
  nombreFiltro: string,
  filtros: FiltrosDonaciones
): Promise<FiltroDonacion> => {
  const mutation = `
    mutation GuardarFiltroDonacion($input: FiltroDonacionInput!) {
      guardarFiltroDonacion(input: $input) {
        id
        nombreFiltro
        usuarioId
        categoria
        fechaDesde
        fechaHasta
        eliminado
        fechaCreacion
      }
    }
  `;

  const input: any = {
    nombreFiltro,
    usuarioId: String(usuarioId),
  };

  if (filtros.categoria) input.categoria = filtros.categoria;
  if (filtros.fechaDesde) input.fechaDesde = filtros.fechaDesde;
  if (filtros.fechaHasta) input.fechaHasta = filtros.fechaHasta;
  if (filtros.eliminado !== undefined && filtros.eliminado !== null) {
    input.eliminado = filtros.eliminado;
  }

  const response = await fetch(`${BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: mutation, variables: { input } }),
  });

  if (!response.ok) {
    throw new Error("Error al guardar filtro de donaciones");
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(`Error de GraphQL: ${result.errors[0].message}`);
  }

  return result.data.guardarFiltroDonacion;
};

export const actualizarFiltroDonacion = async (
  id: string,
  usuarioId: number,
  nombreFiltro: string,
  filtros: FiltrosDonaciones
): Promise<FiltroDonacion> => {
  const mutation = `
    mutation ActualizarFiltroDonacion($id: ID!, $input: FiltroDonacionInput!) {
      actualizarFiltroDonacion(id: $id, input: $input) {
        id
        nombreFiltro
        usuarioId
        categoria
        fechaDesde
        fechaHasta
        eliminado
        fechaCreacion
      }
    }
  `;

  const input: any = {
    nombreFiltro,
    usuarioId: String(usuarioId),
  };

  if (filtros.categoria) input.categoria = filtros.categoria;
  if (filtros.fechaDesde) input.fechaDesde = filtros.fechaDesde;
  if (filtros.fechaHasta) input.fechaHasta = filtros.fechaHasta;
  if (filtros.eliminado !== undefined && filtros.eliminado !== null) {
    input.eliminado = filtros.eliminado;
  }

  const response = await fetch(`${BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: mutation, variables: { id, input } }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar filtro de donaciones");
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(`Error de GraphQL: ${result.errors[0].message}`);
  }

  return result.data.actualizarFiltroDonacion;
};

export const eliminarFiltroDonacion = async (id: string, usuarioId: number): Promise<boolean> => {
  const mutation = `
    mutation EliminarFiltroDonacion($id: ID!, $usuarioId: ID!) {
      eliminarFiltroDonacion(id: $id, usuarioId: $usuarioId)
    }
  `;

  const response = await fetch(`${BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: mutation, variables: { id, usuarioId: String(usuarioId) } }),
  });

  if (!response.ok) {
    throw new Error("Error al eliminar filtro de donaciones");
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(`Error de GraphQL: ${result.errors[0].message}`);
  }

  return result.data.eliminarFiltroDonacion;
};

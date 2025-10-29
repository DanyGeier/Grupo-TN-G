import type { FiltroEventosInput, InformeEventosResponse } from '../models/informeEventos';

const API_BASE_URL = 'http://localhost:5000';

export const obtenerInformeEventos = async (
  filtro: FiltroEventosInput
): Promise<InformeEventosResponse> => {
  const query = `
    query InformeEventosPropios($filtro: FiltroEventosInput!) {
      informeEventosPropios(filtro: $filtro) {
        mes
        eventos {
          dia
          nombreEvento
          descripcion
          donaciones
        }
      }
    }
  `;

  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/informes/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      query,
      variables: { filtro },
    }),
  });

  if (!response.ok) {
    throw new Error('Error al obtener informe de eventos');
  }

  const result = await response.json();

  if (result.errors) {
    console.error('GraphQL Errors:', result.errors);
    throw new Error(result.errors[0]?.message || 'Error de GraphQL');
  }

  return result.data;
};
const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

export type CategoriaInventario = 0 | 1 | 2 | 3; // ROPA, ALIMENTOS, JUGUETES, UTILES_ESCOLARES

export interface InventarioItemApi {
  id: number;
  categoria: CategoriaInventario; // enum numérico
  descripcion: string;
  cantidad: number;
  eliminado: boolean;
  fechaAlta: number;
  usuarioAlta: string;
  fechaModificacion: number;
  usuarioModificacion: string;
}

export interface ListaInventarioResponse {
  items: InventarioItemApi[];
}

const authHeaders = (token: string | null) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export async function listarInventario(token: string | null): Promise<InventarioItemApi[]> {
  const r = await fetch(`${API_URL}/inventario`, { headers: authHeaders(token) });
  if (!r.ok) throw new Error(`Error listando inventario: ${r.status}`);
  const data = (await r.json()) as ListaInventarioResponse;
  return data.items ?? [];
}

export async function crearItem(
  token: string | null,
  categoria: string,
  descripcion: string,
  cantidad: number
): Promise<InventarioItemApi> {
  const r = await fetch(`${API_URL}/inventario`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ categoria, descripcion, cantidad }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function actualizarItem(
  token: string | null,
  id: number,
  descripcion: string,
  cantidad: number
): Promise<InventarioItemApi> {
  const r = await fetch(`${API_URL}/inventario/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ descripcion, cantidad }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function bajaLogicaItem(token: string | null, id: number): Promise<{ mensaje: string; exito: boolean }> {
  const r = await fetch(`${API_URL}/inventario/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export function nombreCategoria(v: CategoriaInventario): string {
  return ["ROPA", "ALIMENTOS", "JUGUETES", "UTILES_ESCOLARES"][v] ?? "N/A";
}

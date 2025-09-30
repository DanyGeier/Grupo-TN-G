import { estadoMap, rolMap } from "../../../models/rol";
import type { CrearUsuarioRequest } from "../../../models/crearUsuarioRequest";
import type { Usuario } from "../../../models/usuario";
import type { ActualizarUsuarioRequest } from "../../../models/actualizarUsuarioRequest";

const BASE_URL = "http://localhost:5000/usuarios";

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const obtenerUsuario = async (id: string): Promise<Usuario> => {
  const res = await fetch(`${BASE_URL}/${id}`, { headers: authHeaders() });

  if (!res.ok) throw new Error("Error al obtener usuario");
  return res.json();
};

export const registrarUsuario = async (usuario: CrearUsuarioRequest): Promise<Usuario> => {
  const response = await fetch(`${BASE_URL}`,{
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(usuario),
  });
  if(!response.ok){
    const payload = await response.json().catch(()=>null);
    throw new Error(payload?.error || "Error al registrar usuario");
  }
  return await response.json();
};

export const actualizarUsuario = async (id: string, data: ActualizarUsuarioRequest): Promise<Usuario> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if(!response.ok){
    const payload = await response.json().catch(()=>null);
    throw new Error(payload?.error || "Error al actualizar usuario");
  }
  return await response.json();
};

export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  const response = await fetch(`${BASE_URL}`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Error al cargar usuarios");
  const data = await response.json();
  return (data.usuarios as Usuario[]) ?? [];
};

export const obtenerUsuariosActivos = async (): Promise<Usuario[]> => {
  const response = await fetch(`${BASE_URL}/activos`, { headers: authHeaders() });
  if (!response.ok) {
    const payload = await response.json().catch(()=>null);
    throw new Error(payload?.error || "Error al cargar usuarios activos");
  }
  const data = await response.json();
  const lista = (data.usuarios as Usuario[]) ?? [];
  // Salvaguarda: forzar filtro por estado ACTIVO (0)
  return lista.filter(u => u.estado === 0);
};

export const obtenerUsuariosInactivos = async (): Promise<Usuario[]> => {
  const todos = await obtenerUsuarios();
  // estado: 0=ACTIVO, 1=INACTIVO, 2=SUSPENDIDO
  return todos.filter(u => u.estado !== 0);
};

export const darDeBaja = async (usuarioId: number): Promise<{message: string}> => {
  const response = await fetch(`${BASE_URL}/${usuarioId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    const payload = await response.json().catch(()=>null);
    throw new Error(payload?.error || "Error al desactivar el usuario");
  }

  return response.json(); 
};

export const activarUsuario = async (id: string, data: Usuario): Promise<Usuario> => {
  const usuarioActivado: ActualizarUsuarioRequest = {
    id: Number(id),
    nombreUsuario: data.nombreUsuario,
    nombre: data.nombre,
    apellido: data.apellido,
    telefono: data.telefono || "",
    email: data.email,
    estado: estadoMap[0], // "ACTIVO"
    rol: (rolMap as readonly string[])[data.rol]
  };

  return await actualizarUsuario(id, usuarioActivado);
};
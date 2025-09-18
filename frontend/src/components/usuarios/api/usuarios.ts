import type { Usuario } from "../../../models/usuario";

const BASE_URL = "http://localhost:8080/usuarios";

export const obtenerUsuario = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener usuario");
  return res.json();
};

export const crearUsuario = async (data: any) =>
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const actualizarUsuario = async (id: string, data: any) =>
  fetch(`${BASE_URL}/actualizar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });


  export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await fetch("http://localhost:8080/usuarios");
    if (!response.ok) throw new Error("Error al cargar usuarios");
    return await response.json();
  } catch (error) {
    throw new Error("Error al cargar usuarios: " + error);
  }

  
};
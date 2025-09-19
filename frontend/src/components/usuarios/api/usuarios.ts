import type { Usuario } from "../../../models/usuario";

const BASE_URL = "http://localhost:5000/usuarios";

export const obtenerUsuario = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`);

  if (!res.ok) throw new Error("Error al obtener usuario");
  return res.json();
};

// export const crearUsuario = async (data: any) =>
//   fetch(BASE_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

export const registrarUsuario = async (usuario: any) => {
  const response = await fetch("http://localhost:5000/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return await response.json();
};


export const actualizarUsuario = async (id: string, data: any) => {
const response = await fetch(`${BASE_URL}/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

  return await response.json(); // Esto es clave
};


export const obtenerUsuarios = async (): Promise<any[]> => {
  try {
    const response = await fetch("http://localhost:5000/usuarios");
    if (!response.ok) throw new Error("Error al cargar usuarios");
    const data = await response.json();
    return data.usuarios; 
  } catch (error) {
    throw new Error("Error al cargar usuarios: " + error);
  }

  
};

export const desactivarUsuario = async (usuarioId: number) => {
  const response = await fetch(`http://localhost:5000/usuarios/${usuarioId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al desactivar el usuario");
  }

  return response.json(); // { message: "...", success: true/false }
};
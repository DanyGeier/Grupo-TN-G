import type { Usuario } from "../../../models/usuario";

export interface LoginRequest {
  nombreUsuario: string;
  clave: string;
}

export interface LoginResponse {

  usuario:Usuario;
  token: string;
}


export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  return await response.json();
};



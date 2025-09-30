import type { Usuario } from "../../../models/usuario";

export interface LoginRequest {
  nombreUsuario: string;
  clave: string;
}

export interface LoginResponse {
  usuario: Usuario;
  token: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get("content-type") || "";
  let payload: unknown = null;
  if (contentType.includes("application/json")) {
    payload = await response.json();
  }

  if (!response.ok) {
    const errMsg =
      payload && typeof payload === "object" && payload !== null && "error" in payload
        ? String((payload as any).error)
        : response.status === 401
        ? "Credenciales incorrectas"
        : "Error de autenticación";
    throw new Error(errMsg);
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Respuesta inválida del servidor");
  }

  const dataObj = payload as { usuario?: Usuario; token?: string };
  if (!dataObj.token || !dataObj.usuario) {
    throw new Error("Respuesta inválida del servidor");
  }

  // Normalizar token: si viene con prefijo 'Bearer ', removerlo
  let token = dataObj.token;
  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }

  return { usuario: dataObj.usuario, token };
};

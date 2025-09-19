import { createContext, useContext, useState, type ReactNode } from "react";
import type { Usuario } from "../models/usuario";

interface UserContextType {
  usuario: Usuario | null;
  token: string | null;
  loginUser: (usuario: Usuario, token: string) => void;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(
    JSON.parse(localStorage.getItem("usuario") || "null")
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const loginUser = (usuario: Usuario, token: string) => {
    setUsuario(usuario);
    setToken(token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("token", token);
  };

  const logoutUser = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ usuario, token, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe estar dentro de UserProvider");
  return context;
};
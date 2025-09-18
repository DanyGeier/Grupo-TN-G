import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export const Header = () => {
  const usuario = useContext(UserContext);

  return (
    <header className="w-full bg-blue-600 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/home" className="text-xl font-bold">
          Empuje Solidario
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link to="/home" className="hover:underline">
            Inicio
          </Link>
          <Link to="/usuarios" className="hover:underline">
            Usuarios
          </Link>
          <Link to="/eventos" className="hover:underline">
            Eventos
          </Link>
        </nav>

        <div>
          {usuario?.rol === "PRESIDENTE" && (
            <Link
              to="/registro"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow hover:bg-gray-100"
            >
              Registrar Usuario
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

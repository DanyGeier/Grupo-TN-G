import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/useTheme";
import { useState } from "react";

export const Header = () => {
  const { usuario, logoutUser } = useUser();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [showDonaciones, setShowDonaciones] = useState(false);
  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };
  return (
    <header
      className={`w-full ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-blue-600 text-white"
      } shadow-md`}
    >
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

          <div className="relative group">
            <button className="hover:underline flex items-center gap-1">
              Eventos externos
              <span className="text-sm">▾</span>
            </button>

            <div
              className={`absolute left-0 top-full mt-2 w-48 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                isDark ? "bg-gray-800 text-gray-100" : "bg-white text-black"
              }`}
            >
              <Link
                to="/eventos-externos/solicitudes"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Solicitudes de donacion
              </Link>
              <Link
                to="/eventos-externos/lista-eventos"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Lista de eventos externos
              </Link>
     
            </div>
          </div>
      
          <Link to="/inventario" className="hover:underline">
            Inventarios
          </Link>
          <div className="relative group">
            <button className="hover:underline flex items-center gap-1">
              Donaciones
              <span className="text-sm">▾</span>
            </button>

            <div
              className={`absolute left-0 top-full mt-2 w-48 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                isDark ? "bg-gray-800 text-gray-100" : "bg-white text-black"
              }`}
            >
              <Link
                to="/donaciones/solicitar"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Solicitar
              </Link>
                 <Link
                to="/donaciones/lista-solicitudes"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Lista de Solicitudes
              </Link>
    
              <Link
                to="/donaciones/ofrecer"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Ofrecer
              </Link>
            </div>
          </div>
               <Link to="/informes/presidentes-ongs" className="hover:underline">
            Informe Presidente
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`${
              isDark
                ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                : "bg-white text-blue-600 hover:bg-gray-100"
            } rounded-lg px-3 py-2 text-sm font-medium shadow`}
            aria-label="Alternar modo oscuro"
            title={isDark ? "Modo claro" : "Modo oscuro"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          {/* Botón visible solo para PRESIDENTE  -- USAR MAPPER MEJOR*/}
          {usuario?.rol === 0 && (
            <Link
              to="/registro"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow hover:bg-gray-100"
            >
              Registrar Usuario
            </Link>
          )}
          {usuario && (
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

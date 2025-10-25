import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/useTheme";

export const Header = () => {
  const { usuario, logoutUser } = useUser();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

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
          <Link to="/inventario" className="hover:underline">
            Inventarios
          </Link>
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

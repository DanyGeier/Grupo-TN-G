import { useNavigate } from "react-router-dom";

export const AccesoDenegado = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <h1 className="text-4xl font-bold text-red-600 dark:text-red-400">
        Acceso denegado
      </h1>
      <p className="mt-2 text-gray-700 dark:text-gray-300">
        No tienes permisos para ver esta página.
      </p>

      <button
        onClick={() => navigate("/home")}
        className="mt-8 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700"
      >
        Volver al inicio
      </button>
    </div>
  );
};

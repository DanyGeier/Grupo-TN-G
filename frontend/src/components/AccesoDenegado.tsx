import { useNavigate } from "react-router-dom";

export const AccesoDenegado = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-600">Acceso denegado</h1>
      <p>No tienes permisos para ver esta página.</p>

      <button
        onClick={() => navigate("/home")}
        className="mt-8 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 transition"
      >
        Volver al inicio
      </button>
    </div>
  );
};

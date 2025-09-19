import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useUser } from "../context/UserContext";
import { rolesMap } from "../models/rol";

export const HomePage = () => {
  const navigate = useNavigate();
  const { usuario } = useUser();

  //  Significa que card puede ver cada rol. Ej: El presidente ´puede ver todas ya que tiene todos los permisos,
  //   El vocal solo va a poder ver la card de inventario, ya que su rol solo le permite eso
  const cardsPorRol: Record<number, string[]> = {
    0: ["Usuarios", "Eventos", "Inventario", "Configuración"], // PRESIDENTE
    1: ["Inventario"], // VOCAL
    2: ["Eventos"], // COORDINADOR
    3: ["Eventos"], // VOLUNTARIO
  };

  const cards = [
    {
      title: "Usuarios",
      description: "Gestionar usuarios",
      route: "/usuarios",
    },
    { title: "Eventos", description: "Ver y crear eventos", route: "/eventos" },
    {
      title: "Inventario",
      description: "Gestionar Inventarios",
      route: "/inventario",
    },
    {
      title: "Configuración",
      description: "Ajustes del sistema",
      route: "/settings",
    },
  ];

  const filteredCards = usuario
    ? cards.filter((card) => cardsPorRol[usuario.rol]?.includes(card.title))
    : [];

  return (
    <>
      <Header></Header>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-10">
          Empuje Solidario
        </h1>

        {usuario && (
          <p className="mb-6 text-gray-700">
            Bienvenido,{" "}
            <span className="font-bold">{usuario.nombreUsuario}</span> - Rol:{" "}
            <span className="font-semibold"> {rolesMap[usuario!.rol]}</span>
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.route)}
              className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 w-64 h-40 flex flex-col justify-center items-center hover:shadow-2xl hover:scale-105 transition"
            >
              <h2 className="text-2xl font-semibold text-blue-600">
                {card.title}
              </h2>
              <p className="text-gray-600 mt-2 text-center">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

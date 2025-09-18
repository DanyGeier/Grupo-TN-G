import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import type { Usuario } from "../../models/usuario";
import { Header } from "../Header";
import { obtenerUsuarios } from "./api/usuarios";

export const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  
  // Llamada al backend al iniciar el componente
  useEffect(() => {
    const listaUsuarios = async () => {
      try {
        const data = await obtenerUsuarios();
        setUsuarios(data);
      } catch (error) {
        setError("No se pudieron cargar los usuarios");
      } 
    };
    listaUsuarios();
  }, []);

  // Funciones para los botones
  const handleActualizar = (id: number) => {
    navigate(`/usuarios/${id}/editar`);
  };

  const handleDarDeBaja = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/eliminar/${id}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        const usuarioActualizado: Usuario = await response.json();

        setUsuarios((prev) =>
          prev.map((u) =>
            u.id === usuarioActualizado.id ? usuarioActualizado : u
          )
        );
      } else {
        console.error("Error al dar de baja al usuario");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <>
      <Header></Header>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Lista de Usuarios
        </h2>

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full table-auto bg-white divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Apellido
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Teléfono
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {usuarios.map((user: Usuario) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-150 text-gray-700"
                >
                  <td className="px-4 py-3 text-left">{user.nombreUsuario}</td>
                  <td className="px-4 py-3 text-left">{user.nombre}</td>
                  <td className="px-4 py-3 text-left">{user.apellido}</td>
                  <td className="px-4 py-3 text-left">
                    {user.telefono ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-left">{user.email}</td>
                  <td className="px-4 py-3 text-left">{user.rol}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      user.activo ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user.activo ? "Activo" : "Inactivo"}
                  </td>

                  <td className="px-4 py-3 flex justify-center space-x-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      title="Actualizar"
                      onClick={() => handleActualizar(user.id)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      title="Dar de baja"
                      onClick={() => handleDarDeBaja(user.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-col">
          <button
            onClick={() => navigate("/registro")} //
            className="hover:bg-blue-600 cursor-pointer bg-blue-500 rounded-xl text-lg py-3 text-white"
          >
            Crear nuevo usuario
          </button>
        </div>
      </div>
    </>
  );
};

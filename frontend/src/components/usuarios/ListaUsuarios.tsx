import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import type { Usuario } from "../../models/usuario";
import { Header } from "../Header";
import {
  activarUsuario,
  darDeBaja,
  obtenerUsuario,
  obtenerUsuarios,
  obtenerUsuariosActivos,
  obtenerUsuariosInactivos,
} from "./api/usuarios";
import { rolesMap } from "../../models/rol";

export const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState<"TODOS" | "ACTIVOS" | "INACTIVOS">("TODOS");
  const navigate = useNavigate();

  const cargar = async () => {
    try {
      if (filtro === "ACTIVOS") {
        const activos = await obtenerUsuariosActivos();
        setUsuarios(activos.filter(u => u.estado === 0));
      } else if (filtro === "INACTIVOS") {
        setUsuarios(await obtenerUsuariosInactivos());
      } else {
        setUsuarios(await obtenerUsuarios());
      }
    } catch {
      alert("No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    void cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const handleActualizar = (id: number) => {
    navigate(`/usuarios/${id}/editar`);
  };

  const handleToggleActivo = async (u: Usuario) => {
    try {
      if (u.estado === 0) {
        const ok = window.confirm("¿Dar de baja este usuario?");
        if (!ok) return;
        await darDeBaja(u.id);
      } else {
        const usuarioActual = await obtenerUsuario(u.id.toString());
        await activarUsuario(u.id.toString(), usuarioActual);
      }
      await cargar();
      alert("Estado actualizado ✅");
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el estado del usuario");
    }
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Lista de Usuarios</h2>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as "TODOS" | "ACTIVOS" | "INACTIVOS")}
            className="border rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVOS">Activos</option>
            <option value="INACTIVOS">No activos</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full table-auto bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Usuario</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Apellido</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Rol</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {usuarios.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-gray-700 dark:text-gray-200">
                  <td className="px-4 py-3 text-left">{user.nombreUsuario}</td>
                  <td className="px-4 py-3 text-left">{user.nombre}</td>
                  <td className="px-4 py-3 text-left">{user.apellido}</td>
                  <td className="px-4 py-3 text-left">{user.email}</td>
                  <td className="px-4 py-3 text-left">{rolesMap[user.rol]}</td>
                  <td className={`px-4 py-3 font-semibold ${user.estado === 0 ? "text-green-600" : "text-red-600"}`}>
                    {user.estado === 0 ? "Activo" : "Inactivo"}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      title="Actualizar"
                      onClick={() => handleActualizar(user.id)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      className={`cursor-pointer flex items-center gap-2 ${user.estado === 0 ? "text-green-600 hover:text-green-700" : "text-gray-500 hover:text-gray-700"}`}
                      title={user.estado === 0 ? "Dar de baja" : "Activar usuario"}
                      onClick={() => handleToggleActivo(user)}
                    >
                      <FontAwesomeIcon icon={user.estado === 0 ? faToggleOn : faToggleOff} />
                      <span>{user.estado === 0 ? "Activo" : "Inactivo"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-col">
          <button
            onClick={() => navigate("/registro")}
            className="hover:bg-blue-600 cursor-pointer bg-blue-500 rounded-xl text-lg py-3 text-white"
          >
            Crear nuevo usuario
          </button>
        </div>
      </div>
    </>
  );
};

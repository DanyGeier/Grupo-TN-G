import { useEffect, useState } from "react";
import { Header } from "../Header";
import { useNavigate, useParams } from "react-router-dom";
import {
  actualizarUsuario,
  obtenerUsuario,
  registrarUsuario,
} from "./api/usuarios";
import type { CrearUsuarioRequest } from "../../models/crearUsuarioRequest";
import type { ActualizarUsuarioRequest } from "../../models/actualizarUsuarioRequest";

export const FormularioUsuario = () => {
   // si en la url hay un id, es edición; sino, es creacion
  const { id } = useParams<{ id: string }>();


  const navigate = useNavigate();

  // Estado único para el formulario
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    rol: "VOLUNTARIO",
    estado: "INACTIVO", // solo se usa en edición
  });
const rolMap = ["PRESIDENTE", "VOCAL", "COORDINADOR", "VOLUNTARIO"];
const estadoMap = ["ACTIVO", "INACTIVO", "SUSPENDIDO"];

  // Cargar datos si estamos editando
useEffect(() => {
  if (id) {
    obtenerUsuario(id)
      .then((data) => {
        setFormData({
          nombreUsuario: data.nombreUsuario ?? "",
          nombre: data.nombre ?? "",
          apellido: data.apellido ?? "",
          telefono: data.telefono ?? "",
          email: data.email ?? "",
          rol: rolMap[data.rol],
          estado: estadoMap[data.estado],
        });
      })
      .catch((err) => {
        console.error("Error al obtener usuario:", err);
        alert("No se pudo cargar el usuario");
      });
  }
}, [id]);
  // Manejo genérico de cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (id) {
        // Actualización
        const usuarioActualizar: ActualizarUsuarioRequest = {
          id: Number(id),
          nombreUsuario: formData.nombreUsuario,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          email: formData.email,
          rol: formData.rol,
          estado: formData.estado!,
        };
        console.log(usuarioActualizar);
        await actualizarUsuario(id, usuarioActualizar);
        alert("Usuario actualizado ✅");
      } else {
        // Creación
        const usuarioNuevo: CrearUsuarioRequest = {
          nombreUsuario: formData.nombreUsuario,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          email: formData.email,
          rol: formData.rol,
        };
        console.log(usuarioNuevo)
        await registrarUsuario(usuarioNuevo);
        alert("Usuario creado ✅");
      }
      navigate("/usuarios");
    } catch (err) {
      console.error(err);
      alert("Error al guardar usuario");
    }
  };
  
  return (
    <>
      <Header />
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 px-10 py-14 rounded-2xl mt-4 text-gray-800 dark:text-gray-100"
        >
          <div className="text-left">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">Nombre de usuario</label>
            <input
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Ingrese su nombre de usuario"
              required
            />
          </div>

          <div className="mt-4 text-left">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">Nombre</label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Ingresar nombre"
              required
            />
          </div>

          <div className="mt-4 text-left">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">Apellido</label>
            <input
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Ingresar apellido"
              required
            />
          </div>

          <div className="mt-4 text-left">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
            <input
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Ingresar teléfono"
            />
          </div>

          <div className="mt-4 text-left">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Ingresar email"
              required
            />
          </div>

          <div className="mt-4 text-left">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="PRESIDENTE">Presidente</option>
              <option value="VOLUNTARIO">Voluntario</option>
              <option value="COORDINADOR">Coordinador</option>
              <option value="VOCAL">Vocal</option>
            </select>
          </div>

          { id && (
            <div className="mt-4 text-left">
              <label className="text-lg font-medium text-gray-700 dark:text-gray-300">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="SUSPENDIDO">Suspendido</option>

              </select>
            </div>
          )}

          <div className="mt-8 flex flex-col">
            <button
              type="submit"
              className="hover:bg-blue-600 cursor-pointer bg-blue-500 rounded-xl text-lg py-3 text-white"
            >
              {id ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

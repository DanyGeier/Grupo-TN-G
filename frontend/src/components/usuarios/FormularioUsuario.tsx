import { useEffect, useState } from "react";
import { Header } from "../Header";
import { useNavigate, useParams } from "react-router-dom";
import {
  actualizarUsuario,
  obtenerUsuario,
  registrarUsuario,
} from "./api/usuarios";

export const FormularioUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreUsuario: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    rol: "",
    //estado: ""
  });

  // Precargar datos si es edición
  useEffect(() => {
    if (id) {
      obtenerUsuario(id)
        .then(setFormData)
        .catch((err) => console.error("Error:", err));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (id) {
        await actualizarUsuario(id, formData);
        alert("Usuario actualizado");
      } else {
        await registrarUsuario(formData);
        alert("Usuario creado");
      }

      navigate("/usuarios");
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      alert("Error al procesar el usuario");
    }
  };

  return (
    <>
      <Header />
      <div>
        <form
          onSubmit={handleSubmit}
          className="bg-white px-10 py-14 rounded-2xl mt-4"
        >
          <div className="text-left">
            <label className="text-lg font-medium">Nombre de usuario</label>
            <input
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1"
              placeholder="Ingrese su nombre de usuario"
              required
            />
          </div>

          <div className="mt-4 text-left">
            <label className="text-lg font-medium">Nombre</label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1"
              placeholder="Ingresar nombre"
              required
            />
          </div>

          <div className="mt-4 text-left">
            <label className="text-lg font-medium">Apellido</label>
            <input
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1"
              placeholder="Ingresar apellido"
              required
            />
          </div>

          <div className="mt-4 text-left">
            <label className="text-lg font-medium">Teléfono</label>
            <input
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1"
              placeholder="Ingresar teléfono"
            />
          </div>

          <div className="mt-4 text-left">
            <label className="text-lg font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1"
              placeholder="Ingresar email"
              required
            />
          </div>

          <div className="mt-4 text-left">
            <label className="text-lg font-medium">Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1"
              required
            >
              <option value="PRESIDENTE">Presidente</option>
              <option value="VOLUNTARIO">Voluntario</option>
              <option value="COORDINADOR">Coordinador</option>
              <option value="VOCAL">Vocal</option>
            </select>
          </div>

      
          
          {/* {id && (
            <div className="mt-4 text-left">
              <label className="text-lg font-medium">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1"
                required
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="SUSPENDIDO">Suspendido</option>
              </select>
            </div>
          )} */}

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

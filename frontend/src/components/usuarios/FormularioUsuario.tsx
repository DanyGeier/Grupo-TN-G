import { useEffect, useState } from "react";
import { Header } from "../Header";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerUsuario } from "./api/usuarios";

export const FormularioUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    rol: "VOLUNTARIO",
    activo: true,
  });



  // Precargar datos si es edición
  useEffect(() => {
  if (id) {
    obtenerUsuario(id)
      .then(setFormData)
      .catch((err) => console.error("Error:", err));
  }
}, [id]);


const handleChange = (
  e: React.ChangeEvent<any> // no se si esto está bien xd
) => {
  const { name, type, value, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = id
      ? `http://localhost:8080/usuarios/actualizar/${id}`
      : "http://localhost:8080/usuarios";
    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(id ? "Usuario actualizado" : "Usuario creado");
        navigate("/usuarios");
      } else {
        const error = await response.text();
        alert("Error: " + error);
      }
    } catch (error) {
      alert("Error de conexión: " + error);
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
              name="username"
              value={formData.username}
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
            </select>
          </div>

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

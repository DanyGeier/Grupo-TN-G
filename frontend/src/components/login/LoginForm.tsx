import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./api/auth";
import { useUser } from "../../context/UserContext";
import type { Usuario } from "../../models/usuario";

interface LoginRequest {
  nombreUsuario: string;
  clave: string;
}

export const LoginForm = () => {
  const { loginUser } = useUser();
  const [loginRequest, setLoginRequest] = useState<LoginRequest>({
    nombreUsuario: "",
    clave: "",
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginRequest({
      ...loginRequest,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(null); // limpiar error cuando el usuario escribe
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    // Usuario hardcodeado para pruebas
    if (
      loginRequest.nombreUsuario === "admin" &&
      loginRequest.clave === "1234"
    ) {
      // Creamos el usuario hardcodeado siguiendo tu interface
      const fakeUser: Usuario = {
        id: 0,
        nombreUsuario: "admin",
        nombre: "Administrador",
        apellido: "Sistema",
        telefono: "0000000000",
        email: "admin@example.com",
        rol: 0,       // por ejemplo 1 = ADMIN
        estado: true, // activo
      };

      const fakeToken = "fake-jwt-token";

      loginUser(fakeUser, fakeToken); // guardamos en contexto
      navigate("/home");
      return;
    }

    // Login normal para usuarios reales
    const data = await login(loginRequest);

    // Guardar en contexto
    loginUser(data.usuario, data.token);

    navigate("/home");
  } catch (err: any) {
    setErrorMessage(err.message);
  }
};
  const isFormValid = loginRequest.nombreUsuario && loginRequest.clave;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>

      <form
        onSubmit={handleLogin}
        className="bg-white px-10 py-8 rounded-2xl mt-8 shadow-lg w-96"
      >
        {/* Usuario */}
        <div>
          <label htmlFor="nombreUsuario" className="text-lg font-medium">
            Nombre de usuario
          </label>
          <input
            id="nombreUsuario"
            name="nombreUsuario"
            value={loginRequest.nombreUsuario}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500"
            placeholder="Ingresar nombre de usuario"
          />
        </div>

        {/* Contraseña */}
        <div className="mt-4">
          <label htmlFor="clave" className="text-lg font-medium">
            Contraseña
          </label>
          <input
            id="clave"
            name="clave"
            type="password"
            value={loginRequest.clave}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500"
            placeholder="Ingrese su contraseña"
          />
        </div>

        {/* Mensaje de error */}
        {errorMessage && (
          <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
        )}

        {/* Botón */}
        <div className="mt-6 flex flex-col">
          <button
            type="submit"
            className={`rounded-xl text-lg py-3 text-white transition ${
              isFormValid
                ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                : "bg-blue-300"
            }`}
          >
            Ingresar
          </button>
        </div>
      </form>
    </div>
  );
};

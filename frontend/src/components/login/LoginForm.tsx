import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./api/auth";
import { useUser } from "../../context/UserContext";

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
      const data = await login(loginRequest);

      // Guardar en contexto
      loginUser(data.usuario, data.token);

      navigate("/home");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setErrorMessage(message);
    }
  };
  const isFormValid = loginRequest.nombreUsuario && loginRequest.clave;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Bienvenido
      </h1>

      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 px-10 py-8 rounded-2xl mt-8 shadow-lg w-96"
      >
        {/* Usuario */}
        <div>
          <label
            htmlFor="nombreUsuario"
            className="text-lg font-medium text-gray-800 dark:text-gray-100"
          >
            Usuario o email
          </label>
          <input
            id="nombreUsuario"
            name="nombreUsuario"
            value={loginRequest.nombreUsuario}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
            placeholder="Ingresar usuario o email"
          />
        </div>

        {/* Contraseña */}
        <div className="mt-4">
          <label
            htmlFor="clave"
            className="text-lg font-medium text-gray-800 dark:text-gray-100"
          >
            Contraseña
          </label>
          <input
            id="clave"
            name="clave"
            type="password"
            value={loginRequest.clave}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
            placeholder="Ingrese su contraseña"
          />
        </div>

        {/* Mensaje de error */}
        {errorMessage && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-300">
            {errorMessage}
          </p>
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

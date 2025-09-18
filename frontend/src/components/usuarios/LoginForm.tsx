import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginRequest {
  username: string;
  password: string;
}

export const LoginForm = () => {
  const [loginRequest, setLoginRequest] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginRequest({
      ...loginRequest,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginRequest.username.trim() || !loginRequest.password.trim()) {
      setErrorMessage("⚠️ Complete todos los campos antes de continuar.");
      return;
    }

    // ✅ Simulación de login correcto
    if (loginRequest.username === "admin" && loginRequest.password === "1234") {
      setErrorMessage("");
      console.log("✅ Login exitoso!");

      // Redirige al dashboard (o a la ruta que quieras)
      navigate("/home");
      return;
    }

    // ❌ Simulación de login incorrecto
    setErrorMessage(
      "❌ El correo electrónico o nombre de usuario que has introducido no está conectado a una cuenta."
    );
  };
  const isFormValid = loginRequest.username && loginRequest.password;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white px-10 py-8 rounded-2xl mt-8 shadow-lg w-96"
      >
        {/* Usuario */}
        <div>
          <label htmlFor="username" className="text-lg font-medium">
            Nombre de usuario
          </label>
          <input
            id="username"
            name="username"
            value={loginRequest.username}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500"
            placeholder="Ingresar nombre de usuario"
          />
        </div>

        {/* Contraseña */}
        <div className="mt-4">
          <label htmlFor="password" className="text-lg font-medium">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={loginRequest.password}
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

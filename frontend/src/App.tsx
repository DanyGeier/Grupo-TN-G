import "./App.css";
import { Route, Routes } from "react-router-dom";
import { FormularioUsuario } from "./components/usuarios/FormularioUsuario";
import { ListaUsuarios } from "./components/usuarios/ListaUsuarios";
import { ToastContainer } from "react-toastify";
import { HomePage } from "./components/HomePage";
import { LoginForm } from "./components/login/LoginForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useUser } from "./context/UserContext";
import { AccesoDenegado } from "./components/AccesoDenegado";

function App() {
  const { usuario } = useUser();
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={2000} />

      <Routes>

        {/* Login */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/acceso-denegado" element={<AccesoDenegado />} />

        
        {/* Home: cualquier usuario logueado */}
        <Route element={<ProtectedRoute isAllowed={!!usuario} />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* Rutas de usuarios: solo PRESIDENTE */}
        <Route
          element={
            <ProtectedRoute
              // redirectTo="/home"
              redirectTo="/acceso-denegado"
              isAllowed={!!usuario && usuario.rol === 0}
            />
          }
        >
          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/registro" element={<FormularioUsuario />} />
          <Route path="/usuarios/:id/editar" element={<FormularioUsuario />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

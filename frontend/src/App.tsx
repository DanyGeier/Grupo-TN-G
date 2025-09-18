import "./App.css";
import { Route, Routes } from "react-router-dom";
import { FormularioUsuario } from "./components/usuarios/FormularioUsuario";
import type { Usuario } from "./models/usuario";
import { UserContext } from "./context/UserContext";
import { ListaUsuarios } from "./components/usuarios/ListaUsuarios";
import { LoginForm } from "./components/usuarios/LoginForm";
import { ToastContainer } from "react-toastify";
import { HomePage } from "./components/HomePage";


function App() {
  const usuarioSimulado: Usuario = {
    id: 1,
    nombreUsuario: "jdoe",
    nombre: "Juan",
    apellido: "Doe",
    email: "jdoe@example.com",

    rol: "PRESIDENTE", // Cambiar a VOLUNTARIO o COORDINADOR para probar
    activo: true,
    telefono: "",
  };

  return (
    <>
    <ToastContainer
      position="bottom-right"
      autoClose={2000}    
    
    
    />
      <UserContext.Provider value={usuarioSimulado}>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/registro" element={<FormularioUsuario />} />
          <Route path="/usuarios/:id/editar" element={<FormularioUsuario />} />

        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;

import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ListaUsuarios } from "./components/usuarios/ListaUsuarios";
import { ToastContainer } from "react-toastify";
import { HomePage } from "./components/HomePage";
import { LoginForm } from "./components/login/LoginForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useUser } from "./context/UserContext";
import { AccesoDenegado } from "./components/AccesoDenegado";
import { ListaEventos } from "./components/eventos/ListaEventos";
import { EventoForm } from "./components/eventos/EventoForm";
import { FormularioUsuario } from "./components/usuarios/FormularioUsuario";
import { InventarioLista } from "./components/inventario/InventarioLista";
import { FormSolicitarDonaciones } from "./components/donaciones/FormSolicitarDonaciones";
import { FormOfrecerDonaciones } from "./components/donaciones/FormOfrecerDonaciones";
import { ListaSolicitudesExternas } from "./components/donaciones/ListaSolicitudesExternas";
import { ListaEventosExternos } from "./components/eventos/eventosExternos/ListaEventosExternos";
// import { ListaEventosExternos } from "./components/eventos/eventosExternos/ListaEventosExternos";

function App() {
  const { usuario } = useUser();
  const esPresidente = usuario?.rol === 0;
  const esVocal = usuario?.rol === 1;
  const esCoordinador = usuario?.rol === 2;
  const esVoluntario = usuario?.rol === 3;
  const puedeGestionarEventos = !!usuario && (esPresidente || esCoordinador);
  const puedeVerInventario = !!usuario && (esPresidente || esVocal);
  const puedeVerEventos =
    !!usuario && (esPresidente || esCoordinador || esVoluntario);
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={2000} />

      {/* ------------------------------------------------- */}
      <Routes>
        {/* ---------------------------------------------------- */}

        {/* Login */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/acceso-denegado" element={<AccesoDenegado />} />

        {/* Home: cualquier usuario logueado */}
        <Route element={<ProtectedRoute isAllowed={!!usuario} />}>
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/donaciones/solicitar"
            element={<FormSolicitarDonaciones />}
          />
          <Route
            path="/donaciones/ofrecer"
            element={<FormOfrecerDonaciones />}
          />
          {/* <Route
            path="/donaciones/lista-solicitudes"
            element={<ListaSolicitudesPropias />}
          /> */}
          <Route
            path="/eventos-externos/solicitudes"
            element={<ListaSolicitudesExternas />}
          />
          <Route
            path="/eventos-externos/lista-eventos"
            element={<ListaEventosExternos />}
          />
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

        {/* Inventario: PRESIDENTE o VOCAL */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={puedeVerInventario}
              redirectTo="/acceso-denegado"
            />
          }
        >
          <Route path="/inventario" element={<InventarioLista />} />
        </Route>

        {/* Eventos: PRESIDENTE, COORDINADOR o VOLUNTARIO */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={puedeVerEventos}
              redirectTo="/acceso-denegado"
            />
          }
        >
          <Route path="/eventos" element={<ListaEventos />} />
        </Route>
        {/* Crear/editar eventos: PRESIDENTE o COORDINADOR */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={puedeGestionarEventos}
              redirectTo="/acceso-denegado"
            />
          }
        >
          <Route path="/eventos/nuevo" element={<EventoForm />} />
          <Route path="/eventos/:id/editar" element={<EventoForm />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import {
  faPen,
  faPlus,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import type { EventoResponse } from "../../models/eventoResponse";
import { Boton } from "../Boton";
import { useUser } from "../../context/UserContext";
import type { UsuarioDto } from "../../models/dto/usuarioDto";
import { ModalParticipantes } from "../modales/ModalParticipantes";
import { ModalDonaciones } from "../modales/ModalDonaciones";
import { usuarios } from "../../mocks";

type Props = {
  evento: EventoResponse;
  onEdit?: (evento: EventoResponse) => void;
  onDelete?: (id: number) => void;
  onToggleParticipation?: (id: number) => void;
};

export const EventoCard = ({
  evento,
  onEdit,
  onDelete,
  onToggleParticipation,
}: Props) => {
  //Participantes del evento, es decir usuarios que participan actualmente del evento
  const [participantesEvento, setParticipantesEvento] = useState<UsuarioDto[]>(
    evento.miembros
  );

  //Todos los usuarios que no participan en el evento se listaran y se podran agregar al evento, y se eliminaran de la
  //lista de disponibles
  const [miembrosDisponibles, setMiembrosDisponibles] = useState<UsuarioDto[]>(
    []
  );

  const filtrarUsuariosDisponibles = (
    todos: UsuarioDto[],
    participantes: UsuarioDto[]
  ): UsuarioDto[] => {
    const idsParticipantes = new Set(participantes.map((u) => u.id));
    return todos.filter((u) => !idsParticipantes.has(u.id));
  };

  useEffect(() => {
    setMiembrosDisponibles(
      filtrarUsuariosDisponibles(usuarios, participantesEvento)
    );
  }, [participantesEvento]);

  const [mostrarModalDonaciones, setMostrarModalDonaciones] = useState(false);
  const { usuario, logoutUser } = useUser();
  const esFechaFutura = evento.fechaHora > new Date() ? true : false;
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "delete" | "add">("view");

  const puedeEditarOEliminar = usuario?.rol === 0;
  const puedeUnirse = usuario?.rol === 3;

  //te dice si el usuario logueado ya es participante de ese evento, para mostrar un botón de “Unirse” o “Salir del evento”.
  const usuarioLogueadoParticipaEnEvento = usuario
    ? participantesEvento.some((u: UsuarioDto) => u.id === usuario.id)
    : false;

  const abrirModal = (modo: "view" | "delete" | "add") => {
    setModalMode(modo);
    setMostrarModal(true);
  };

  // const abrirModalAgregar = async () => {
  //   const res = await fetch(
  //     `http://localhost:8080/eventos/${evento.id}/usuarios-disponibles`
  //   );
  //   const data: Usuario[] = await res.json();
  //   setUsuariosDisponibles(data);
  //   setModalMode("add");
  //   setMostrarModal(true);
  // };

  const abrirModalAgregar = async () => {
    const disponibles = filtrarUsuariosDisponibles(
      usuarios,
      participantesEvento
    );

    setMiembrosDisponibles(disponibles);

    // Abrimos el modal en modo "add"
    setModalMode("add");
    setMostrarModal(true);
  };

  // const handleAddParticipant = async (usuarioId: number) => {
  //   try {
  //     await agregarParticipante(evento.id, usuarioId); // llamada al backend

  //     // Buscar el usuario en la lista de disponibles
  //     const usuario = usuariosDisponibles.find((u) => u.id === usuarioId);
  //     if (!usuario) return;

  //     // Agregar a la lista local de miembros
  //     setMiembros((prev) => [...prev, usuario]);

  //     // Quitar de la lista de disponibles
  //     setUsuariosDisponibles((prev) => prev.filter((u) => u.id !== usuarioId));
  //     toast.success("Participante agregado ✅");
  //   } catch (err) {
  //     console.error(err);
  //     alert("No se pudo agregar al participante");
  //     toast.error("Error al agregar participante");
  //   }
  // };

  // const handleRemoveParticipant = async (usuarioId: number) => {
  //   try {
  //     await quitarParticipante(evento.id, usuarioId);

  //     setMiembros((prev) => prev.filter((m: Usuario) => m.id !== usuarioId));

  //     toast.info("❌ Participante eliminado");
  //   } catch (err) {
  //     console.error(err);
  //     alert("No se pudo eliminar al participante");
  //   }
  // };

  const handleAddParticipant = (usuarioId: number) => {
    const usuario = miembrosDisponibles.find((u) => u.id === usuarioId);
    if (!usuario) return;

    // Agregamos el usuario al estado de participantes
    setParticipantesEvento((prev: UsuarioDto[]) => [...prev, usuario]);

    // Lo eliminamos de la lista de disponibles
    setMiembrosDisponibles((prev) => prev.filter((u) => u.id !== usuarioId));

    toast.success("Participante agregado ✅");
  };

  const handleRemoveParticipant = (usuarioId: number) => {
    const usuario = participantesEvento.find((u) => u.id === usuarioId);
    if (!usuario) return;

    // Eliminamos al usuario de los participantes del evento
    setParticipantesEvento((prev) => prev.filter((u) => u.id !== usuarioId));

    // Lo agregamos nuevamente a la lista de disponibles
    setMiembrosDisponibles((prev) => [...prev, usuario]);

    toast.info("❌ Participante eliminado");
  };
  return (
    <>
      <div className="bg-white shadow-sm rounded-xl p-5 hover:shadow-md transition">
        <h3 className="text-xl font-semibold text-gray-800">
          {evento.nombreEvento}
        </h3>
        <p className="text-gray-600 mt-2">{evento.descripcion}</p>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>
            Fecha y hora: {new Date(evento.fechaHora).toLocaleString()}
          </span>
          <span>Participantes: {participantesEvento.length}</span>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          {puedeEditarOEliminar && (
            <>
              <Boton
                onClick={() => onEdit && onEdit(evento)}
                text="Editar evento"
                icon={<FontAwesomeIcon icon={faPen} />}
                color="azul"
              />

              <Boton
                onClick={() => onDelete && onDelete(evento.id)}
                text="Eliminar evento"
                icon={<FontAwesomeIcon icon={faTrash} />}
                color="rojo"
              />

              <Boton
                onClick={() => abrirModal("view")}
                text={`Ver participantes (${participantesEvento.length})`}
                color="rosa"
              />

              <Boton
                onClick={() => abrirModal("delete")}
                text="Eliminar voluntarios"
                icon={<FontAwesomeIcon icon={faUserMinus} />}
                color="rojo"
              />

              <Boton
                onClick={abrirModalAgregar}
                text="Agregar voluntarios"
                icon={<FontAwesomeIcon icon={faPlus} />}
                color="verde"
              />

              <Boton
                onClick={() => setMostrarModalDonaciones(true)}
                text="Ver Donaciones"
                color="ambar"
              />
            </>
          )}
        </div>

        {puedeUnirse && (
          <button
            onClick={() =>
              onToggleParticipation && onToggleParticipation(evento.id)
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition cursor-pointer
    ${
      usuarioLogueadoParticipaEnEvento
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-green-500 hover:bg-green-600 text-white"
    }`}
          >
            {usuarioLogueadoParticipaEnEvento
              ? "Salir del evento"
              : "Unirse al evento"}
            <FontAwesomeIcon
              icon={usuarioLogueadoParticipaEnEvento ? faUserMinus : faUserPlus}
            />
          </button>
        )}
      </div>

      {mostrarModal && (
        <ModalParticipantes
          participantes={
            modalMode === "add" ? miembrosDisponibles : participantesEvento
          }
          open={true}
          onClose={() => setMostrarModal(false)}
          onRemove={handleRemoveParticipant}
          onAdd={handleAddParticipant}
          mode={modalMode}
        />
      )}

      {mostrarModalDonaciones && (
        <ModalDonaciones
          open={true}
          onClose={() => setMostrarModalDonaciones(false)}
        />
      )}
    </>
  );
};

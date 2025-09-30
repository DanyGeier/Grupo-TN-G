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
import { obtenerUsuarios, obtenerUsuariosActivos } from "../usuarios/api/usuarios";
import { eventosApiService } from "../../services/eventosApi";

type Props = {
  evento: EventoResponse;
  onEdit?: (evento: EventoResponse) => void;
  onDelete?: (id: string) => void | Promise<void>;
  onToggleParticipation?: (id: string) => void | Promise<void>;
};

export const EventoCard = ({
  evento,
  onEdit,
  onDelete,
  onToggleParticipation,
}: Props) => {
  const [participantesEvento, setParticipantesEvento] = useState<UsuarioDto[]>(
    evento.miembros
  );

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
    setParticipantesEvento(evento.miembros);
  }, [evento]);

  const refreshParticipantes = async (): Promise<UsuarioDto[]> => {
    try {
      const detalle = await eventosApiService.obtenerEvento(evento.id);
      let miembros = detalle.miembros;
      // Si todos vienen como placeholders ("Usuario {id}"), intentar resolver nombres reales
      const placeholders =
        miembros.length > 0 && miembros.every((m) => m.nombre === "Usuario");
      if (placeholders) {
        try {
          // 1) Intentar con usuarios activos (PRESIDENTE/COORDINADOR tienen acceso)
          const activos = await obtenerUsuariosActivos();
          const mapaActivos = new Map<number, UsuarioDto>(
            activos.map((u) => [
              u.id,
              { id: u.id, nombre: u.nombre, apellido: u.apellido },
            ])
          );
          miembros = miembros.map((m) => mapaActivos.get(m.id) || m);

          // 2) Si aún quedan placeholders y el logueado es PRESIDENTE, resolver con todos los usuarios (incluye inactivos)
          if (miembros.some((m) => m.nombre === "Usuario")) {
            const yo = usuario;
            if (yo && yo.rol === 0) {
              const todos = await obtenerUsuarios();
              const mapaTodos = new Map<number, UsuarioDto>(
                todos.map((u) => [
                  u.id,
                  { id: u.id, nombre: u.nombre, apellido: u.apellido },
                ])
              );
              miembros = miembros.map((m) => mapaTodos.get(m.id) || m);
            }
          }
        } catch {
          // mantener placeholders si no se puede resolver
        }
      }
      setParticipantesEvento(miembros);
      return miembros;
    } catch {
      // mantener estado actual si falla
      return participantesEvento;
    }
  };

  const [mostrarModalDonaciones, setMostrarModalDonaciones] = useState(false);
  const { usuario } = useUser();
  const esFechaFutura = evento.fechaHora > new Date();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "delete" | "add">("view");

  const puedeEditarOEliminar = !!usuario && (usuario.rol === 0 || usuario.rol === 2);
  const puedeUnirse = usuario?.rol === 3;

  const usuarioLogueadoParticipaEnEvento = usuario
    ? participantesEvento.some((u: UsuarioDto) => u.id === usuario.id)
    : false;

  const abrirModal = async (modo: "view" | "delete" | "add") => {
    await refreshParticipantes();
    setModalMode(modo);
    setMostrarModal(true);
  };

  const abrirModalAgregar = async () => {
    try {
      const participantes = await refreshParticipantes();
      const activos = await obtenerUsuariosActivos();
      const disponibles = filtrarUsuariosDisponibles(
        activos.map((a) => ({
          id: a.id,
          nombre: a.nombre,
          apellido: a.apellido,
        })),
        participantes
      );
      setMiembrosDisponibles(disponibles);
      setModalMode("add");
      setMostrarModal(true);
    } catch {
      toast.error("Error al cargar usuarios activos");
    }
  };

  const handleAddParticipant = async (usuarioId: number) => {
    try {
      await eventosApiService.asignarParticipante(evento.id, usuarioId);
      const detalle = await eventosApiService.obtenerEvento(evento.id);
      setParticipantesEvento(detalle.miembros);
      setMiembrosDisponibles((prev) => prev.filter((u) => u.id !== usuarioId));
      toast.success("Participante agregado ✅");
    } catch {
      toast.error("Error al agregar participante");
    }
  };

  const handleRemoveParticipant = async (usuarioId: number) => {
    try {
      await eventosApiService.quitarParticipante(evento.id, usuarioId);
      const detalle = await eventosApiService.obtenerEvento(evento.id);
      setParticipantesEvento(detalle.miembros);
      toast.info("❌ Participante eliminado");
    } catch {
      toast.error("Error al eliminar participante");
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5 hover:shadow-md transition">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {evento.nombreEvento}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{evento.descripcion}</p>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Fecha y hora: {new Date(evento.fechaHora).toLocaleString()}
          </span>
          <span>Participantes: {participantesEvento.length}</span>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          {puedeEditarOEliminar && esFechaFutura && (
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
            </>
          )}

          {/* Siempre permitir ver participantes y donaciones */}
          <Boton
            onClick={() => abrirModal("view")}
            text={`Ver participantes (${participantesEvento.length})`}
            color="rosa"
          />

          <Boton
            onClick={() => setMostrarModalDonaciones(true)}
            text="Ver Donaciones"
            color="ambar"
          />
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
          eventoId={evento.id}
          donaciones={evento.donaciones}
          puedeAgregar={!esFechaFutura && (usuario?.rol === 0 || usuario?.rol === 2)}
        />
      )}
    </>
  );
};

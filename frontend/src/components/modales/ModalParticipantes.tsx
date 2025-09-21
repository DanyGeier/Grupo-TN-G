import { faUserMinus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Usuario } from "../models/usuario";

interface Props {
  participantes: Usuario[];
  open: boolean;
  onClose: () => void;
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
  mode: "view" | "delete" | "add";
}

export const ModalParticipantes = ({
  participantes,
  open,
  onClose,
  onRemove,
  onAdd,
  mode,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">
          {mode === "delete" ? "Eliminar Participantes" : "Participantes"}
          {/* Participantes ({participantes.length}) */}
        </h3>

        {participantes.length > 0 ? (
          <ul className="space-y-2">
            {participantes.map((usuario) => (
              <li
                key={usuario.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                    {usuario.nombre.charAt(0)}
                  </div>
                  <span>
                    {usuario.nombre} {usuario.apellido}
                  </span>
                </div>

                {mode === "delete" && (
                  <button
                    onClick={() => onRemove(usuario.id)}
                    className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faUserMinus} />
                    Eliminar
                  </button>
                )}
                {mode === "add" && (
                  <button
                    onClick={() => onAdd(usuario.id)}
                    className="text-green-500 hover:text-green-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                    Agregar
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            {mode === "delete"
              ? "No hay participantes para eliminar"
              : mode === "add"
              ? "No hay participantes disponibles para agregar"
              : "No hay participantes aún"}
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

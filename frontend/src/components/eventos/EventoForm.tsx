import { useState, useEffect } from "react";

import { Header } from "../Header";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import type { EventoResponse } from "../../models/eventoResponse";
import type { CrearEventoRequest } from "../../models/crearEventoRequest";

export const EventoForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaHora, setFechaHora] = useState<Date>();

  const [eventosMock, setEventosMock] = useState<EventoResponse[]>([]);
  useEffect(() => {
    setEventosMock(eventosMock);
  }, []);

  // useEffect(() => {
  //   if (id) {
  //     obtenerEvento(id)
  //       .then((evento: { nombre: SetStateAction<string>; descripcion: SetStateAction<string>; fechaHora: string | number | Date; miembros: Usuario[]; }) => {
  //         setNombre(evento.nombre);
  //         setDescripcion(evento.descripcion);
  //         setFechaHora(new Date(evento.fechaHora).toISOString().slice(0, 16)); // para datetime-local
  //         setMiembros(evento.miembros.map((m: Usuario) => m.id));
  //       })
  //       .catch((err) => console.error("Error:", err));
  //   }
  // }, [id]);

  // Traer usuarios para poder asignar miembros --> Esto al final no lo voy a usar. Primero se crea el evento, y luego se le
  //asignan miembros

  // useEffect(() => {
  //   fetch("http://localhost:5000/usuarios")
  //     .then((res) => res.json())
  //     .then((data) => setUsuarios(data))
  //     .catch((err) => console.error("Error al cargar usuarios:", err));
  // }, []);

  //Por ahora uso los usuarios mockeados, aunque podria cargar los del back

  /*
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // DTO para enviar al backend
  const evento: Omit<Evento, "id"> = {
    nombre,
    descripcion,
    fechaHora: new Date(fechaHora),
    miembros: usuarios.filter((u) => miembros.includes(u.id)),
  };

  // Si existe `id`, entonces es edición, si no, es creación
  const url = id
    ? `http://localhost:8080/eventos/actualizar/${id}`
    : "http://localhost:8080/eventos";

  const method = id ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evento),
  });

  if (res.ok) {
    alert(id ? "Evento actualizado ✅" : "Evento creado con éxito ");
    if (!id) {
      // Solo limpio el form si fue creación
      setNombre("");
      setDescripcion("");
      setFechaHora("");
      setMiembros([]);
    }
  } else {
    alert("Error al guardar evento ");
  }
};

*/

  //Aca tendria que mandar el CrearEventoRequest al back para que mapee el DTO con la entidad Evento.
  //Por ahora simulo el comportamiento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fechaHora) {
      alert("Por favor selecciona una fecha y hora");
      return;
    }

    // 1️⃣ Crear el DTO
    const nuevoEventoDTO: CrearEventoRequest = {
      nombreEvento: nombre,
      descripcion,
      fechaHora: fechaHora, // Date
    };

    // 2️⃣ Simular envío al backend
    console.log("Simulando envío al backend:", nuevoEventoDTO);

    // 3️⃣ (Opcional) actualizar tus mocks localmente para ver efecto
    setEventosMock((prev) => [
      ...prev,
      {
        id: prev.length + 1, // id mock
        nombreEvento: nuevoEventoDTO.nombreEvento,
        descripcion: nuevoEventoDTO.descripcion,
        fechaHora: nuevoEventoDTO.fechaHora, // Date
        miembros: [], // vacío por ahora
        donaciones: [], // vacío por ahora
      },
    ]);

    // Limpiar formulario
    setNombre("");
    setDescripcion("");
    setFechaHora(undefined);

    alert("Evento creado en mock ✅");

    navigate("/eventos");
  };
  return (
    <>
      <Header></Header>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <h2 className="text-3xl font-bold text-gray-800">
          {id ? "Editar evento" : "Crear nuevo evento"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white px-10 py-8 rounded-2xl mt-8 shadow-lg w-full max-w-xl"
        >
          <div>
            <label className="text-lg font-medium">Nombre del evento</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500"
              placeholder="Ingrese el nombre del evento"
            />
          </div>

          <div className="mt-4">
            <label className="text-lg font-medium">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500"
              placeholder="Ingrese una descripción"
            />
          </div>

          <div className="mt-4">
            <label className="text-lg font-medium">Fecha</label>
            <input
              type="date"
              value={fechaHora ? fechaHora.toISOString().slice(0, 10) : ""}
              onChange={(e) => {
                const fecha = new Date(e.target.value);
                if (fechaHora) {
                  fecha.setHours(fechaHora.getHours(), fechaHora.getMinutes());
                }
                setFechaHora(fecha);
              }}
              required
              className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-4">
            <label className="text-lg font-medium">Hora</label>
            <input
              type="time"
              value={
                fechaHora
                  ? `${fechaHora
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${fechaHora
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : ""
              }
              onChange={(e) => {
                if (fechaHora) {
                  const [hours, minutes] = e.target.value
                    .split(":")
                    .map(Number);
                  const nuevaFecha = new Date(fechaHora);
                  nuevaFecha.setHours(hours, minutes);
                  setFechaHora(nuevaFecha);
                }
              }}
              required
              className="w-full border-2 border-gray-200 rounded-2xl p-3 mt-1 outline-none focus:border-blue-500"
            />
          </div>

          {/* Solo mostrar miembros si es creación  --> Al final creo que esto no lo voy a usar*/}

          {/*  {!id && (
            <div className="mt-4">
              <label className="text-lg font-medium">Miembros</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {usuarios.map((u) => (
        <label
          key={u.id}
          className="flex items-center space-x-2 cursor-pointer bg-white border-2 border-gray-200 rounded-2xl p-3 hover:bg-gray-100 transition"
        >
          <input
            type="checkbox"
            checked={miembros.includes(u.id)}
            onChange={() => toggleMiembro(u.id)}
            className="w-5 h-5 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 appearance-none checked:bg-blue-500 checked:border-blue-500 transition"
          />
          <span className="text-gray-700 font-medium">
            {u.nombre} {u.apellido}
          </span>
        </label>
      ))} }
              </div>
            </div> 
          )}*/}

          <div className="mt-8 flex flex-col">
            <button
              type="submit"
              className=" cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl text-lg transition"
            >
              {id ? "Actualizar evento" : "Guardar evento"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

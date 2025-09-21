type Donacion = {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  usuario: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const mockDonaciones: Donacion[] = [
  {
    id: 1,
    nombre: "Ropa de abrigo",
    categoria: "Ropa",
    cantidad: 25,
    usuario: "Juan Pérez",
  },
  {
    id: 2,
    nombre: "Arroz",
    categoria: "Alimentos",
    cantidad: 10,
    usuario: "María Gómez",
  },
  {
    id: 3,
    nombre: "Medicamentos",
    categoria: "Salud",
    cantidad: 15,
    usuario: "Carlos López",
  },
  {
    id: 4,
    nombre: "Juguetes",
    categoria: "Infantil",
    cantidad: 30,
    usuario: "Ana Martínez",
  },
  {
    id: 5,
    nombre: "Agua Mineral",
    categoria: "Bebidas",
    cantidad: 50,
    usuario: "Pedro Sánchez",
  },
];

export const ModalDonaciones = ({ open, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 w-[600px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Donaciones del Evento</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Nombre</th>
              <th className="py-2">Categoría</th>
              <th className="py-2">Cantidad</th>
              <th className="py-2">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {mockDonaciones.map((donacion) => (
              <tr key={donacion.id} className="border-b hover:bg-gray-100">
                <td className="py-2">{donacion.nombre}</td>
                <td className="py-2">{donacion.categoria}</td>
                <td className="py-2">{donacion.cantidad}</td>
                <td className="py-2">{donacion.usuario}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

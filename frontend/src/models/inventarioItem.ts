// Enumeración para las categorías de inventario
export interface Categoria {
  id: number;
  nombre: string;
}

// Interfaz para representar un ítem del inventario
export interface InventarioItem {
  id: number;
  categoria: Categoria;
  nombre: string;
  descripcion: string;
  cantidad: number;
  eliminado: boolean;

  // Campos de auditoría (no visibles en la vista)
  fechaAlta: Date;
  usuarioAlta: string;
  fechaModificacion?: Date;
  usuarioModificacion?: string;
}

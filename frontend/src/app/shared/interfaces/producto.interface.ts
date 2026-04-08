export interface Producto {
  id: number;
  categoria_id: number;
  categoria: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  unidad_medida: string;
  stock_minimo: number;
  requiere_lote: boolean;
  requiere_vencimiento: boolean;
  estado: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductoRequest {
  categoria_id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidad_medida?: string;
  stock_minimo?: number;
  requiere_lote?: boolean;
  requiere_vencimiento?: boolean;
}
export interface Movimiento {
  id: number;
  producto_id: number;
  producto_codigo: string;
  producto_nombre: string;
  lote_id: number | null;
  numero_lote: string | null;
  usuario_id: number;
  usuario: string;
  tipo_movimiento: string;
  cantidad: number;
  fecha_movimiento: string;
  observacion: string | null;
  referencia_tipo: string | null;
  referencia_id: number | null;
  created_at: string;
}

export interface MovimientoFilters {
  page?: number;
  limit?: number;
  producto_id?: number | null;
  lote_id?: number | null;
  tipo_movimiento?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}
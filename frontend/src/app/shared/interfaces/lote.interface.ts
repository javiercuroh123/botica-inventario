export interface Lote {
  id: number;
  producto_id: number;
  producto_codigo: string;
  producto_nombre: string;
  numero_lote: string;
  fecha_vencimiento: string | null;
  cantidad_inicial: number;
  cantidad_actual: number;
  costo_unitario: number;
  fecha_ingreso: string;
  estado: boolean;
  created_at: string;
}

export interface LoteRequest {
  producto_id: number;
  numero_lote: string;
  fecha_vencimiento?: string;
  cantidad_inicial: number;
  cantidad_actual: number;
  costo_unitario?: number;
  fecha_ingreso?: string;
}
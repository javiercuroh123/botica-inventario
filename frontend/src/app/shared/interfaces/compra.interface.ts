export interface Compra {
  id: number;
  proveedor_id: number;
  proveedor: string;
  usuario_id: number;
  usuario: string;
  fecha_compra: string;
  tipo_comprobante: string;
  numero_comprobante: string;
  subtotal: number;
  impuesto: number;
  total: number;
  observacion: string | null;
  created_at: string;
}

export interface CompraDetalle {
  id: number;
  compra_id: number;
  producto_id: number;
  producto_codigo: string;
  producto_nombre: string;
  numero_lote: string;
  fecha_vencimiento: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CompraConDetalles extends Compra {
  detalles: CompraDetalle[];
}

export interface CompraDetalleRequest {
  producto_id: number;
  numero_lote?: string;
  fecha_vencimiento?: string;
  cantidad: number;
  precio_unitario: number;
}

export interface CompraRequest {
  proveedor_id: number;
  fecha_compra?: string;
  tipo_comprobante: string;
  numero_comprobante: string;
  observacion?: string;
  detalles: CompraDetalleRequest[];
}

export interface CompraDetailResponse {
  ok: boolean;
  data: CompraConDetalles;
}
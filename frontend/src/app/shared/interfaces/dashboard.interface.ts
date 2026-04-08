export interface DashboardResumen {
  total_productos_activos: number;
  productos_stock_bajo: number;
  lotes_por_vencer_30: number;
  lotes_vencidos_con_stock: number;
}

export interface DashboardCompra {
  id: number;
  fecha_compra: string;
  tipo_comprobante: string;
  numero_comprobante: string;
  total: number;
  proveedor: string;
  usuario: string;
}

export interface DashboardMovimiento {
  id: number;
  tipo_movimiento: string;
  cantidad: number;
  fecha_movimiento: string;
  observacion: string;
  producto_codigo: string;
  producto_nombre: string;
  numero_lote: string | null;
  usuario: string;
}

export interface DashboardStockBajo {
  id: number;
  codigo: string;
  nombre: string;
  stock_minimo: number;
  stock_actual: number;
}

export interface DashboardLotePorVencer {
  id: number;
  numero_lote: string;
  fecha_vencimiento: string;
  cantidad_actual: number;
  producto_codigo: string;
  producto_nombre: string;
}

export interface DashboardData {
  resumen: DashboardResumen;
  ultimas_compras: DashboardCompra[];
  ultimos_movimientos: DashboardMovimiento[];
  productos_stock_bajo_detalle: DashboardStockBajo[];
  lotes_por_vencer_detalle: DashboardLotePorVencer[];
}

export interface DashboardResponse {
  ok: boolean;
  message: string;
  data: DashboardData;
}
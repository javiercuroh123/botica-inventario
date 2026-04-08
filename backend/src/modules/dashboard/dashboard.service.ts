import { pool } from '../../config/db';

export class DashboardService {
  static async getSummary() {
    const totalProductosQuery = `
      SELECT COUNT(*)::int AS total_productos_activos
      FROM productos
      WHERE estado = TRUE;
    `;

    const stockBajoQuery = `
      SELECT COUNT(*)::int AS productos_stock_bajo
      FROM (
        SELECT
          p.id,
          p.stock_minimo,
          COALESCE(SUM(l.cantidad_actual), 0) AS stock_actual
        FROM productos p
        LEFT JOIN lotes l
          ON l.producto_id = p.id
         AND l.estado = TRUE
        WHERE p.estado = TRUE
        GROUP BY p.id, p.stock_minimo
      ) t
      WHERE t.stock_actual <= t.stock_minimo;
    `;

    const porVencerQuery = `
      SELECT COUNT(*)::int AS lotes_por_vencer_30
      FROM lotes
      WHERE estado = TRUE
        AND cantidad_actual > 0
        AND fecha_vencimiento IS NOT NULL
        AND fecha_vencimiento BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days');
    `;

    const vencidosQuery = `
      SELECT COUNT(*)::int AS lotes_vencidos_con_stock
      FROM lotes
      WHERE estado = TRUE
        AND cantidad_actual > 0
        AND fecha_vencimiento IS NOT NULL
        AND fecha_vencimiento < CURRENT_DATE;
    `;

    const [
      totalProductosResult,
      stockBajoResult,
      porVencerResult,
      vencidosResult
    ] = await Promise.all([
      pool.query(totalProductosQuery),
      pool.query(stockBajoQuery),
      pool.query(porVencerQuery),
      pool.query(vencidosQuery)
    ]);

    return {
      total_productos_activos:
        totalProductosResult.rows[0]?.total_productos_activos ?? 0,
      productos_stock_bajo:
        stockBajoResult.rows[0]?.productos_stock_bajo ?? 0,
      lotes_por_vencer_30:
        porVencerResult.rows[0]?.lotes_por_vencer_30 ?? 0,
      lotes_vencidos_con_stock:
        vencidosResult.rows[0]?.lotes_vencidos_con_stock ?? 0
    };
  }

  static async getUltimasCompras(limit = 5) {
    const query = `
      SELECT
        c.id,
        c.fecha_compra,
        c.tipo_comprobante,
        c.numero_comprobante,
        c.total,
        p.razon_social AS proveedor,
        u.nombres || ' ' || u.apellidos AS usuario
      FROM compras c
      INNER JOIN proveedores p ON p.id = c.proveedor_id
      INNER JOIN usuarios u ON u.id = c.usuario_id
      ORDER BY c.id DESC
      LIMIT $1;
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async getUltimosMovimientos(limit = 10) {
    const query = `
      SELECT
        m.id,
        m.tipo_movimiento,
        m.cantidad,
        m.fecha_movimiento,
        m.observacion,
        p.codigo AS producto_codigo,
        p.nombre AS producto_nombre,
        l.numero_lote,
        u.nombres || ' ' || u.apellidos AS usuario
      FROM movimientos_inventario m
      INNER JOIN productos p ON p.id = m.producto_id
      LEFT JOIN lotes l ON l.id = m.lote_id
      INNER JOIN usuarios u ON u.id = m.usuario_id
      ORDER BY m.fecha_movimiento DESC, m.id DESC
      LIMIT $1;
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async getStockBajo(limit = 10) {
    const query = `
      SELECT
        p.id,
        p.codigo,
        p.nombre,
        p.stock_minimo,
        COALESCE(SUM(l.cantidad_actual), 0) AS stock_actual
      FROM productos p
      LEFT JOIN lotes l
        ON l.producto_id = p.id
       AND l.estado = TRUE
      WHERE p.estado = TRUE
      GROUP BY p.id, p.codigo, p.nombre, p.stock_minimo
      HAVING COALESCE(SUM(l.cantidad_actual), 0) <= p.stock_minimo
      ORDER BY stock_actual ASC, p.nombre ASC
      LIMIT $1;
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async getLotesPorVencer(limit = 10) {
    const query = `
      SELECT
        l.id,
        l.numero_lote,
        l.fecha_vencimiento,
        l.cantidad_actual,
        p.codigo AS producto_codigo,
        p.nombre AS producto_nombre
      FROM lotes l
      INNER JOIN productos p ON p.id = l.producto_id
      WHERE l.estado = TRUE
        AND l.cantidad_actual > 0
        AND l.fecha_vencimiento IS NOT NULL
        AND l.fecha_vencimiento BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
      ORDER BY l.fecha_vencimiento ASC, l.id ASC
      LIMIT $1;
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async getDashboard() {
    const [summary, ultimasCompras, ultimosMovimientos, stockBajo, lotesPorVencer] =
      await Promise.all([
        this.getSummary(),
        this.getUltimasCompras(),
        this.getUltimosMovimientos(),
        this.getStockBajo(),
        this.getLotesPorVencer()
      ]);

    return {
      resumen: summary,
      ultimas_compras: ultimasCompras,
      ultimos_movimientos: ultimosMovimientos,
      productos_stock_bajo_detalle: stockBajo,
      lotes_por_vencer_detalle: lotesPorVencer
    };
  }
}
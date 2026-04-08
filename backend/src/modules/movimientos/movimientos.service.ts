import { pool } from '../../config/db';

interface MovimientoFilters {
  producto_id?: number;
  lote_id?: number;
  usuario_id?: number;
  tipo_movimiento?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

interface MovimientoPagination {
  page: number;
  limit: number;
  offset: number;
}

export class MovimientosService {
  static async findAll(
    filters: MovimientoFilters = {},
    pagination: MovimientoPagination
  ) {
    const conditions: string[] = [];
    const values: Array<string | number> = [];

    if (filters.producto_id) {
      values.push(filters.producto_id);
      conditions.push(`m.producto_id = $${values.length}`);
    }

    if (filters.lote_id) {
      values.push(filters.lote_id);
      conditions.push(`m.lote_id = $${values.length}`);
    }

    if (filters.usuario_id) {
      values.push(filters.usuario_id);
      conditions.push(`m.usuario_id = $${values.length}`);
    }

    if (filters.tipo_movimiento) {
      values.push(filters.tipo_movimiento);
      conditions.push(`m.tipo_movimiento = $${values.length}`);
    }

    if (filters.fecha_desde) {
      values.push(filters.fecha_desde);
      conditions.push(`DATE(m.fecha_movimiento) >= $${values.length}`);
    }

    if (filters.fecha_hasta) {
      values.push(filters.fecha_hasta);
      conditions.push(`DATE(m.fecha_movimiento) <= $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM movimientos_inventario m
      ${whereClause};
    `;

    values.push(pagination.limit);
    values.push(pagination.offset);

    const dataQuery = `
      SELECT
        m.id,
        m.producto_id,
        p.codigo AS producto_codigo,
        p.nombre AS producto_nombre,
        m.lote_id,
        l.numero_lote,
        m.usuario_id,
        u.nombres || ' ' || u.apellidos AS usuario,
        m.tipo_movimiento,
        m.cantidad,
        m.fecha_movimiento,
        m.observacion,
        m.referencia_tipo,
        m.referencia_id,
        m.created_at
      FROM movimientos_inventario m
      INNER JOIN productos p ON p.id = m.producto_id
      LEFT JOIN lotes l ON l.id = m.lote_id
      INNER JOIN usuarios u ON u.id = m.usuario_id
      ${whereClause}
      ORDER BY m.fecha_movimiento DESC, m.id DESC
      LIMIT $${values.length - 1} OFFSET $${values.length};
    `;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, values.slice(0, values.length - 2)),
      pool.query(dataQuery, values)
    ]);

    const total = countResult.rows[0]?.total ?? 0;
    const totalPages = Math.max(Math.ceil(total / pagination.limit), 1);

    return {
      items: dataResult.rows,
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages
      }
    };
  }

  static async findById(id: number) {
    const query = `
      SELECT
        m.id,
        m.producto_id,
        p.codigo AS producto_codigo,
        p.nombre AS producto_nombre,
        m.lote_id,
        l.numero_lote,
        m.usuario_id,
        u.nombres || ' ' || u.apellidos AS usuario,
        m.tipo_movimiento,
        m.cantidad,
        m.fecha_movimiento,
        m.observacion,
        m.referencia_tipo,
        m.referencia_id,
        m.created_at
      FROM movimientos_inventario m
      INNER JOIN productos p ON p.id = m.producto_id
      LEFT JOIN lotes l ON l.id = m.lote_id
      INNER JOIN usuarios u ON u.id = m.usuario_id
      WHERE m.id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}
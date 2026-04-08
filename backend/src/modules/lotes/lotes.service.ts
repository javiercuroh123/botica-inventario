import { pool } from '../../config/db';
import { AppError } from '../../utils/app-error';

interface CreateLoteInput {
  producto_id: number;
  numero_lote: string;
  fecha_vencimiento?: string | null;
  cantidad_inicial: number;
  cantidad_actual: number;
  costo_unitario?: number;
  fecha_ingreso?: string;
}

interface UpdateLoteInput {
  producto_id?: number;
  numero_lote?: string;
  fecha_vencimiento?: string | null;
  cantidad_inicial?: number;
  cantidad_actual?: number;
  costo_unitario?: number;
  fecha_ingreso?: string;
  estado?: boolean;
}

interface FindAllLotesInput {
  page: number;
  limit: number;
  offset: number;
}

export class LotesService {
  static async findAll({ page, limit, offset }: FindAllLotesInput) {
    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM lotes;
    `;

    const dataQuery = `
      SELECT
        l.id,
        l.producto_id,
        p.codigo AS producto_codigo,
        p.nombre AS producto_nombre,
        l.numero_lote,
        l.fecha_vencimiento,
        l.cantidad_inicial,
        l.cantidad_actual,
        l.costo_unitario,
        l.fecha_ingreso,
        l.estado,
        l.created_at
      FROM lotes l
      INNER JOIN productos p ON p.id = l.producto_id
      ORDER BY l.id ASC
      LIMIT $1 OFFSET $2;
    `;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery),
      pool.query(dataQuery, [limit, offset])
    ]);

    const total = countResult.rows[0]?.total ?? 0;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return {
      items: dataResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  static async findById(id: number) {
    const query = `
      SELECT
        l.id,
        l.producto_id,
        p.codigo AS producto_codigo,
        p.nombre AS producto_nombre,
        l.numero_lote,
        l.fecha_vencimiento,
        l.cantidad_inicial,
        l.cantidad_actual,
        l.costo_unitario,
        l.fecha_ingreso,
        l.estado,
        l.created_at
      FROM lotes l
      INNER JOIN productos p ON p.id = l.producto_id
      WHERE l.id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create(data: CreateLoteInput) {
    const productoQuery = `
      SELECT id, nombre, requiere_lote, requiere_vencimiento
      FROM productos
      WHERE id = $1
      LIMIT 1;
    `;

    const productoResult = await pool.query(productoQuery, [data.producto_id]);

    if (productoResult.rows.length === 0) {
      throw new AppError('El producto no existe', 400);
    }

    const producto = productoResult.rows[0];

    if (!producto.requiere_lote) {
      throw new AppError('El producto no maneja lotes', 400);
    }

    if (producto.requiere_vencimiento && !data.fecha_vencimiento) {
      throw new AppError('Este producto requiere fecha de vencimiento', 400);
    }

    if (data.cantidad_actual > data.cantidad_inicial) {
      throw new AppError(
        'La cantidad actual no puede ser mayor que la cantidad inicial',
        400
      );
    }

    const existsQuery = `
      SELECT id
      FROM lotes
      WHERE producto_id = $1
        AND LOWER(numero_lote) = LOWER($2)
      LIMIT 1;
    `;

    const existsResult = await pool.query(existsQuery, [
      data.producto_id,
      data.numero_lote.trim()
    ]);

    if (existsResult.rows.length > 0) {
      throw new AppError('Ya existe ese lote para el producto seleccionado', 409);
    }

    const query = `
      INSERT INTO lotes (
        producto_id,
        numero_lote,
        fecha_vencimiento,
        cantidad_inicial,
        cantidad_actual,
        costo_unitario,
        fecha_ingreso,
        estado
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
      RETURNING
        id,
        producto_id,
        numero_lote,
        fecha_vencimiento,
        cantidad_inicial,
        cantidad_actual,
        costo_unitario,
        fecha_ingreso,
        estado,
        created_at;
    `;

    const values = [
      data.producto_id,
      data.numero_lote.trim(),
      data.fecha_vencimiento || null,
      data.cantidad_inicial,
      data.cantidad_actual,
      data.costo_unitario ?? 0,
      data.fecha_ingreso || new Date().toISOString().slice(0, 10)
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id: number, data: UpdateLoteInput) {
    const current = await this.findById(id);

    if (!current) {
      throw new AppError('Lote no encontrado', 404);
    }

    const productoIdFinal = data.producto_id ?? current.producto_id;
    const numeroLoteFinal = data.numero_lote?.trim() ?? current.numero_lote;
    const fechaVencimientoFinal =
      data.fecha_vencimiento !== undefined
        ? data.fecha_vencimiento || null
        : current.fecha_vencimiento;
    const cantidadInicialFinal =
      data.cantidad_inicial ?? Number(current.cantidad_inicial);
    const cantidadActualFinal =
      data.cantidad_actual ?? Number(current.cantidad_actual);
    const costoUnitarioFinal =
      data.costo_unitario ?? Number(current.costo_unitario);
    const fechaIngresoFinal = data.fecha_ingreso ?? current.fecha_ingreso;
    const estadoFinal = data.estado ?? current.estado;

    const productoQuery = `
      SELECT id, requiere_lote, requiere_vencimiento
      FROM productos
      WHERE id = $1
      LIMIT 1;
    `;

    const productoResult = await pool.query(productoQuery, [productoIdFinal]);

    if (productoResult.rows.length === 0) {
      throw new AppError('El producto no existe', 400);
    }

    const producto = productoResult.rows[0];

    if (!producto.requiere_lote) {
      throw new AppError('El producto no maneja lotes', 400);
    }

    if (producto.requiere_vencimiento && !fechaVencimientoFinal) {
      throw new AppError('Este producto requiere fecha de vencimiento', 400);
    }

    if (cantidadInicialFinal < 0) {
      throw new AppError('La cantidad inicial no puede ser negativa', 400);
    }

    if (cantidadActualFinal < 0) {
      throw new AppError('La cantidad actual no puede ser negativa', 400);
    }

    if (cantidadActualFinal > cantidadInicialFinal) {
      throw new AppError(
        'La cantidad actual no puede ser mayor que la cantidad inicial',
        400
      );
    }

    const existsQuery = `
      SELECT id
      FROM lotes
      WHERE producto_id = $1
        AND LOWER(numero_lote) = LOWER($2)
        AND id <> $3
      LIMIT 1;
    `;

    const existsResult = await pool.query(existsQuery, [
      productoIdFinal,
      numeroLoteFinal,
      id
    ]);

    if (existsResult.rows.length > 0) {
      throw new AppError(
        'Ya existe otro lote con ese número para el producto',
        409
      );
    }

    const query = `
      UPDATE lotes
      SET
        producto_id = $1,
        numero_lote = $2,
        fecha_vencimiento = $3,
        cantidad_inicial = $4,
        cantidad_actual = $5,
        costo_unitario = $6,
        fecha_ingreso = $7,
        estado = $8
      WHERE id = $9
      RETURNING
        id,
        producto_id,
        numero_lote,
        fecha_vencimiento,
        cantidad_inicial,
        cantidad_actual,
        costo_unitario,
        fecha_ingreso,
        estado,
        created_at;
    `;

    const values = [
      productoIdFinal,
      numeroLoteFinal,
      fechaVencimientoFinal,
      cantidadInicialFinal,
      cantidadActualFinal,
      costoUnitarioFinal,
      fechaIngresoFinal,
      estadoFinal,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async remove(id: number) {
    const current = await this.findById(id);

    if (!current) {
      throw new AppError('Lote no encontrado', 404);
    }

    const query = `
      UPDATE lotes
      SET estado = FALSE
      WHERE id = $1
      RETURNING
        id,
        producto_id,
        numero_lote,
        fecha_vencimiento,
        cantidad_inicial,
        cantidad_actual,
        costo_unitario,
        fecha_ingreso,
        estado,
        created_at;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}
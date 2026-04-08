import { pool } from '../../config/db';
import { AppError } from '../../utils/app-error';

interface CreateProductoInput {
  categoria_id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidad_medida?: string;
  stock_minimo?: number;
  requiere_lote?: boolean;
  requiere_vencimiento?: boolean;
}

interface UpdateProductoInput {
  categoria_id?: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string | null;
  unidad_medida?: string;
  stock_minimo?: number;
  requiere_lote?: boolean;
  requiere_vencimiento?: boolean;
  estado?: boolean;
}

interface FindAllProductosInput {
  page: number;
  limit: number;
  offset: number;
}

export class ProductosService {
  static async findAll({ page, limit, offset }: FindAllProductosInput) {
    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM productos;
    `;

    const dataQuery = `
      SELECT
        p.id,
        p.categoria_id,
        c.nombre AS categoria,
        p.codigo,
        p.nombre,
        p.descripcion,
        p.unidad_medida,
        p.stock_minimo,
        p.requiere_lote,
        p.requiere_vencimiento,
        p.estado,
        p.created_at,
        p.updated_at
      FROM productos p
      INNER JOIN categorias c ON c.id = p.categoria_id
      ORDER BY p.id ASC
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
        p.id,
        p.categoria_id,
        c.nombre AS categoria,
        p.codigo,
        p.nombre,
        p.descripcion,
        p.unidad_medida,
        p.stock_minimo,
        p.requiere_lote,
        p.requiere_vencimiento,
        p.estado,
        p.created_at,
        p.updated_at
      FROM productos p
      INNER JOIN categorias c ON c.id = p.categoria_id
      WHERE p.id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create(data: CreateProductoInput) {
    const categoriaQuery = `
      SELECT id
      FROM categorias
      WHERE id = $1
      LIMIT 1;
    `;

    const categoriaResult = await pool.query(categoriaQuery, [data.categoria_id]);

    if (categoriaResult.rows.length === 0) {
      throw new AppError('La categoría no existe', 400);
    }

    const codigoQuery = `
      SELECT id
      FROM productos
      WHERE LOWER(codigo) = LOWER($1)
      LIMIT 1;
    `;

    const codigoResult = await pool.query(codigoQuery, [data.codigo.trim()]);

    if (codigoResult.rows.length > 0) {
      throw new AppError('Ya existe un producto con ese código', 409);
    }

    const query = `
      INSERT INTO productos (
        categoria_id,
        codigo,
        nombre,
        descripcion,
        unidad_medida,
        stock_minimo,
        requiere_lote,
        requiere_vencimiento,
        estado
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
      RETURNING
        id,
        categoria_id,
        codigo,
        nombre,
        descripcion,
        unidad_medida,
        stock_minimo,
        requiere_lote,
        requiere_vencimiento,
        estado,
        created_at,
        updated_at;
    `;

    const values = [
      data.categoria_id,
      data.codigo.trim(),
      data.nombre.trim(),
      data.descripcion?.trim() || null,
      data.unidad_medida?.trim() || 'UNIDAD',
      data.stock_minimo ?? 0,
      data.requiere_lote ?? true,
      data.requiere_vencimiento ?? true
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id: number, data: UpdateProductoInput) {
    const current = await this.findById(id);

    if (!current) {
      throw new AppError('Producto no encontrado', 404);
    }

    const categoriaIdFinal = data.categoria_id ?? current.categoria_id;
    const codigoFinal = data.codigo?.trim() ?? current.codigo;
    const nombreFinal = data.nombre?.trim() ?? current.nombre;
    const descripcionFinal =
      data.descripcion !== undefined
        ? data.descripcion?.trim() || null
        : current.descripcion;
    const unidadMedidaFinal = data.unidad_medida?.trim() ?? current.unidad_medida;
    const stockMinimoFinal = data.stock_minimo ?? Number(current.stock_minimo);
    const requiereLoteFinal = data.requiere_lote ?? current.requiere_lote;
    const requiereVencimientoFinal =
      data.requiere_vencimiento ?? current.requiere_vencimiento;
    const estadoFinal = data.estado ?? current.estado;

    const categoriaQuery = `
      SELECT id
      FROM categorias
      WHERE id = $1
      LIMIT 1;
    `;

    const categoriaResult = await pool.query(categoriaQuery, [categoriaIdFinal]);

    if (categoriaResult.rows.length === 0) {
      throw new AppError('La categoría no existe', 400);
    }

    const codigoQuery = `
      SELECT id
      FROM productos
      WHERE LOWER(codigo) = LOWER($1)
        AND id <> $2
      LIMIT 1;
    `;

    const codigoResult = await pool.query(codigoQuery, [codigoFinal, id]);

    if (codigoResult.rows.length > 0) {
      throw new AppError('Ya existe otro producto con ese código', 409);
    }

    const query = `
      UPDATE productos
      SET
        categoria_id = $1,
        codigo = $2,
        nombre = $3,
        descripcion = $4,
        unidad_medida = $5,
        stock_minimo = $6,
        requiere_lote = $7,
        requiere_vencimiento = $8,
        estado = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING
        id,
        categoria_id,
        codigo,
        nombre,
        descripcion,
        unidad_medida,
        stock_minimo,
        requiere_lote,
        requiere_vencimiento,
        estado,
        created_at,
        updated_at;
    `;

    const values = [
      categoriaIdFinal,
      codigoFinal,
      nombreFinal,
      descripcionFinal,
      unidadMedidaFinal,
      stockMinimoFinal,
      requiereLoteFinal,
      requiereVencimientoFinal,
      estadoFinal,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async remove(id: number) {
    const current = await this.findById(id);

    if (!current) {
      throw new AppError('Producto no encontrado', 404);
    }

    const query = `
      UPDATE productos
      SET
        estado = FALSE,
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        categoria_id,
        codigo,
        nombre,
        descripcion,
        unidad_medida,
        stock_minimo,
        requiere_lote,
        requiere_vencimiento,
        estado,
        created_at,
        updated_at;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}
import { pool } from '../../config/db';
import { AppError } from '../../utils/app-error';

interface CreateCategoriaInput {
  nombre: string;
  descripcion?: string;
}

interface UpdateCategoriaInput {
  nombre?: string;
  descripcion?: string;
  estado?: boolean;
}

interface FindAllCategoriasInput {
  page: number;
  limit: number;
  offset: number;
}

export class CategoriasService {
  static async findAll({ page, limit, offset }: FindAllCategoriasInput) {
    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM categorias;
    `;

    const dataQuery = `
      SELECT
        id,
        nombre,
        descripcion,
        estado,
        created_at
      FROM categorias
      ORDER BY id ASC
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
        id,
        nombre,
        descripcion,
        estado,
        created_at
      FROM categorias
      WHERE id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create(data: CreateCategoriaInput) {
    const existsQuery = `
      SELECT id
      FROM categorias
      WHERE LOWER(nombre) = LOWER($1)
      LIMIT 1;
    `;

    const existsResult = await pool.query(existsQuery, [data.nombre]);

    if (existsResult.rows.length > 0) {
      throw new AppError('Ya existe una categoría con ese nombre', 409);
    }

    const query = `
      INSERT INTO categorias (
        nombre,
        descripcion,
        estado
      )
      VALUES ($1, $2, TRUE)
      RETURNING id, nombre, descripcion, estado, created_at;
    `;

    const values = [data.nombre.trim(), data.descripcion?.trim() || null];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async update(id: number, data: UpdateCategoriaInput) {
    const current = await this.findById(id);

    if (!current) {
      throw new AppError('Categoría no encontrada', 404);
    }

    const nombreFinal = data.nombre?.trim() ?? current.nombre;
    const descripcionFinal =
      data.descripcion !== undefined
        ? data.descripcion.trim() || null
        : current.descripcion;
    const estadoFinal = data.estado ?? current.estado;

    const existsQuery = `
      SELECT id
      FROM categorias
      WHERE LOWER(nombre) = LOWER($1)
        AND id <> $2
      LIMIT 1;
    `;

    const existsResult = await pool.query(existsQuery, [nombreFinal, id]);

    if (existsResult.rows.length > 0) {
      throw new AppError('Ya existe otra categoría con ese nombre', 409);
    }

    const query = `
      UPDATE categorias
      SET
        nombre = $1,
        descripcion = $2,
        estado = $3
      WHERE id = $4
      RETURNING id, nombre, descripcion, estado, created_at;
    `;

    const values = [nombreFinal, descripcionFinal, estadoFinal, id];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async remove(id: number) {
    const current = await this.findById(id);

    if (!current) {
      throw new AppError('Categoría no encontrada', 404);
    }

    const query = `
      UPDATE categorias
      SET estado = FALSE
      WHERE id = $1
      RETURNING id, nombre, descripcion, estado, created_at;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}
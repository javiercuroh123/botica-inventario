import { pool } from '../../config/db';
import { AppError } from '../../utils/app-error';

interface CreateProveedorInput {
  razon_social: string;
  ruc: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  contacto?: string;
}

interface UpdateProveedorInput {
  razon_social?: string;
  ruc?: string;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  contacto?: string | null;
  estado?: boolean;
}

interface FindAllProveedoresInput {
  page: number;
  limit: number;
  offset: number;
}

export class ProveedoresService {
  static async findAll({ page, limit, offset }: FindAllProveedoresInput) {
    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM proveedores;
    `;

    const dataQuery = `
      SELECT
        id,
        razon_social,
        ruc,
        telefono,
        correo,
        direccion,
        contacto,
        estado,
        created_at
      FROM proveedores
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
        razon_social,
        ruc,
        telefono,
        correo,
        direccion,
        contacto,
        estado,
        created_at
      FROM proveedores
      WHERE id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create(data: CreateProveedorInput) {
    const existsRucQuery = `
      SELECT id
      FROM proveedores
      WHERE ruc = $1
      LIMIT 1;
    `;

    const existsRucResult = await pool.query(existsRucQuery, [data.ruc]);

    if (existsRucResult.rows.length > 0) {
      throw new AppError('Ya existe un proveedor con ese RUC', 409);
    }

    const query = `
      INSERT INTO proveedores (
        razon_social,
        ruc,
        telefono,
        correo,
        direccion,
        contacto,
        estado
      )
      VALUES ($1, $2, $3, $4, $5, $6, TRUE)
      RETURNING
        id,
        razon_social,
        ruc,
        telefono,
        correo,
        direccion,
        contacto,
        estado,
        created_at;
    `;

    const values = [
      data.razon_social.trim(),
      data.ruc.trim(),
      data.telefono?.trim() || null,
      data.correo?.trim() || null,
      data.direccion?.trim() || null,
      data.contacto?.trim() || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id: number, data: UpdateProveedorInput) {
    const current = await this.findById(id);

    if (!current) {
      throw new AppError('Proveedor no encontrado', 404);
    }

    const razonSocialFinal = data.razon_social?.trim() ?? current.razon_social;
    const rucFinal = data.ruc?.trim() ?? current.ruc;
    const telefonoFinal =
      data.telefono !== undefined ? data.telefono?.trim() || null : current.telefono;
    const correoFinal =
      data.correo !== undefined ? data.correo?.trim() || null : current.correo;
    const direccionFinal =
      data.direccion !== undefined ? data.direccion?.trim() || null : current.direccion;
    const contactoFinal =
      data.contacto !== undefined ? data.contacto?.trim() || null : current.contacto;
    const estadoFinal = data.estado ?? current.estado;

    const existsRucQuery = `
      SELECT id
      FROM proveedores
      WHERE ruc = $1
        AND id <> $2
      LIMIT 1;
    `;

    const existsRucResult = await pool.query(existsRucQuery, [rucFinal, id]);

    if (existsRucResult.rows.length > 0) {
      throw new AppError('Ya existe otro proveedor con ese RUC', 409);
    }

    const query = `
      UPDATE proveedores
      SET
        razon_social = $1,
        ruc = $2,
        telefono = $3,
        correo = $4,
        direccion = $5,
        contacto = $6,
        estado = $7
      WHERE id = $8
      RETURNING
        id,
        razon_social,
        ruc,
        telefono,
        correo,
        direccion,
        contacto,
        estado,
        created_at;
    `;

    const values = [
      razonSocialFinal,
      rucFinal,
      telefonoFinal,
      correoFinal,
      direccionFinal,
      contactoFinal,
      estadoFinal,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async remove(id: number) {
    const current = await this.findById(id);

    if (!current) {
      throw new AppError('Proveedor no encontrado', 404);
    }

    const query = `
      UPDATE proveedores
      SET estado = FALSE
      WHERE id = $1
      RETURNING
        id,
        razon_social,
        ruc,
        telefono,
        correo,
        direccion,
        contacto,
        estado,
        created_at;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}
import bcrypt from 'bcryptjs';
import { pool } from '../../config/db';

interface CreateUserInput {
  rol_id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  password: string;
}

export class UsersService {
  static async findAll() {
    const query = `
      SELECT
        u.id,
        u.nombres,
        u.apellidos,
        u.correo,
        u.estado,
        u.created_at,
        r.nombre AS rol
      FROM usuarios u
      INNER JOIN roles r ON r.id = u.rol_id
      ORDER BY u.id ASC;
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async create(data: CreateUserInput) {
    const existsQuery = `
      SELECT id
      FROM usuarios
      WHERE correo = $1
      LIMIT 1;
    `;

    const existsResult = await pool.query(existsQuery, [data.correo]);

    if (existsResult.rows.length > 0) {
      throw new Error('El correo ya está registrado');
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const query = `
      INSERT INTO usuarios (
        rol_id,
        nombres,
        apellidos,
        correo,
        password_hash,
        estado
      )
      VALUES ($1, $2, $3, $4, $5, TRUE)
      RETURNING id, rol_id, nombres, apellidos, correo, estado, created_at;
    `;

    const values = [
      data.rol_id,
      data.nombres,
      data.apellidos,
      data.correo,
      password_hash
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}
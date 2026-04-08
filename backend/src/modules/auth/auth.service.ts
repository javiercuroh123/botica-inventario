import bcrypt from 'bcryptjs';
import { pool } from '../../config/db';
import { generateToken } from '../../utils/jwt';

interface LoginInput {
  correo: string;
  password: string;
}

export class AuthService {
  static async login({ correo, password }: LoginInput) {
    const query = `
      SELECT
        u.id,
        u.nombres,
        u.apellidos,
        u.correo,
        u.password_hash,
        r.nombre AS rol
      FROM usuarios u
      INNER JOIN roles r ON r.id = u.rol_id
      WHERE u.correo = $1
        AND u.estado = TRUE
      LIMIT 1;
    `;

    const result = await pool.query(query, [correo]);

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return null;
    }

    const token = generateToken({
      id: user.id,
      correo: user.correo,
      rol: user.rol
    });

    return {
      token,
      usuario: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        rol: user.rol
      }
    };
  }

  static async getProfile(userId: number) {
    const query = `
      SELECT
        u.id,
        u.nombres,
        u.apellidos,
        u.correo,
        u.estado,
        r.nombre AS rol
      FROM usuarios u
      INNER JOIN roles r ON r.id = u.rol_id
      WHERE u.id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows[0] || null;
  }
}
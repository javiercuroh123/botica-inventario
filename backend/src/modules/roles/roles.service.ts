import { pool } from '../../config/db';

export class RolesService {
  static async findAll() {
    const query = `
      SELECT id, nombre, descripcion, estado, created_at
      FROM roles
      ORDER BY id ASC;
    `;

    const result = await pool.query(query);
    return result.rows;
  }
}
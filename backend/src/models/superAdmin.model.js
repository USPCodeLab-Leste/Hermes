import pool from "../config/database.js";
import crypto from "crypto";

class SuperAdmin {

  async getUsersOverview() {
    const query = `
      SELECT
        -- usuários comuns verificados
        (
          SELECT COALESCE(JSON_AGG(
            JSON_BUILD_OBJECT(
              'email', email,
              'role', role,
              'is_verified', is_verified
            )
          ), '[]')
          FROM tb_user
          WHERE role NOT IN ('ADMIN', 'SUPERADMIN')
            AND is_verified = true
        ) AS usuarios,

        (
          SELECT COUNT(*)
          FROM tb_user
          WHERE role NOT IN ('ADMIN', 'SUPERADMIN')
            AND is_verified = true
        ) AS total_usuarios,

        -- não verificados
        (
          SELECT COALESCE(JSON_AGG(email), '[]')
          FROM tb_user
          WHERE is_verified = false
        ) AS unverified_emails,

        (
          SELECT COUNT(*)
          FROM tb_user
          WHERE is_verified = false
        ) AS total_unverified,

        -- admins
        (
          SELECT COALESCE(JSON_AGG(email), '[]')
          FROM tb_user
          WHERE role = 'ADMIN'
        ) AS admin_emails,

        (
          SELECT COUNT(*)
          FROM tb_user
          WHERE role = 'ADMIN'
        ) AS total_admins
    `;

    const result = await pool.query(query);

    return result.rows[0];
  }

  async createAdmin({ name, email, password }) {
    const query = `
      INSERT INTO tb_user (id, name, email, password, role, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, role
    `;

    const values = [
      crypto.randomUUID(),
      name,
      email,
      password,
      "ADMIN",
      true
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

}

export default new SuperAdmin();
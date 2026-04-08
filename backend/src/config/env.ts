import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT || 3000),
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT || 5433),
  DB_NAME: process.env.DB_NAME || 'botica_db',
  DB_USER: process.env.DB_USER || 'botica_user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'botica_pass',
  JWT_SECRET: process.env.JWT_SECRET || 'botica_super_clave_segura_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h'
};
import app from './app';
import { env } from './config/env';
import { pool } from './config/db';

async function start() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL correcta');
    client.release();

    app.listen(env.PORT, () => {
      console.log(`✅ Backend corriendo en http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con PostgreSQL:', error);
    process.exit(1);
  }
}

start();
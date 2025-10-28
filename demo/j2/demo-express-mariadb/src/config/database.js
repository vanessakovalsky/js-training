// === CONFIGURATION BASE DE DONNÉES ===

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'stock_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Tester la connexion
 */
export async function testerConnexion() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion à la base de données réussie');
    connection.release();
    return true;
  } catch (erreur) {
    console.error('❌ Erreur de connexion à la base de données:', erreur.message);
    return false;
  }
}

export default pool;
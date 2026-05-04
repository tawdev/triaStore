const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function createDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'tria_db'}\`;`);
    console.log(`✔ Database "${process.env.DB_NAME || 'tria_db'}" created or already exists.`);
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
  } finally {
    await connection.end();
  }
}

createDb();

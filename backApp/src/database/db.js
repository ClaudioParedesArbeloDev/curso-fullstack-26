import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'tienda';

const config = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD
};

export const pool = mysql.createPool({
    ...config,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});


export async function initDatabase() {
    const conn = await mysql.createConnection(config);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await conn.end();

    await pool.query(`
        CREATE TABLE IF NOT EXISTS productos(
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            precio DECIMAL(10,2) NOT NULL,
            stock INT NOT NULL DEFAULT 0,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log(`Conectado a MySQL, base de datos "${DB_NAME}" lista`);
}

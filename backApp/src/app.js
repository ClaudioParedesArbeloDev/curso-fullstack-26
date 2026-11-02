import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'

import { initDatabase } from './database/db.js';

import productosRoutes from './routes/productos.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000

const ORIGIN = process.env.ORIGIN

app.use(cors({origin: ORIGIN}))

app.use(express.json());

app.use('/api/products', productosRoutes)

try {
    await initDatabase();
    app.listen(PORT, () => {
        console.log(`Servidor en http://localhost:${PORT}`)
    })
} catch (error) {
    console.error('No se pudo inicializar la base de datos:', error.message);
    process.exit(1);
}

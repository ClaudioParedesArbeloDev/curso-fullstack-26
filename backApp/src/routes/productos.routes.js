import { Router } from "express";
import { pool } from "../database/db.js";

const router = Router();


//llama a todos
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//llamar a un producto en especifico
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//crear un producto
router.post('/', async (req, res) => {
    try {
        const { nombre, precio, stock = 0 } = req.body ?? {};
        if (!nombre || precio === undefined) {
            return res.status(400).json({ error: 'nombre y precio son obligatorios' });
        }
        const [result] = await pool.query(
            'INSERT INTO productos(nombre, precio, stock) VALUES(?, ?, ?)',
            [nombre, precio, stock]
        );
        res.status(201).json({ id: result.insertId, nombre, precio, stock });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//modificar un producto
router.put('/:id', async (req, res) => {
    try {
        const { nombre, precio, stock } = req.body ?? {};
        const [result] = await pool.query(
            `UPDATE productos SET
                nombre = COALESCE(?, nombre),
                precio = COALESCE(?, precio),
                stock = COALESCE(?, stock)
             WHERE id = ?`,
            [nombre ?? null, precio ?? null, stock ?? null, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;



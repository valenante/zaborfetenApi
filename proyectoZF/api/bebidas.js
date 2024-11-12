const express = require('express');
const router = express.Router();
const Bebida = require('../models/Bebidas'); // Ajusta la ruta según tu estructura de archivos

// Crear una nueva bebida
router.post('/', async (req, res) => {
    try {
        const nuevaBebida = new Bebida(req.body);
        await nuevaBebida.save();
        res.status(201).json(nuevaBebida);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todas las bebidas
router.get('/', async (req, res) => {
    try {
        const bebidas = await Bebida.find();
        res.status(200).json(bebidas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener una bebida por ID
router.get('/:id', async (req, res) => {
    try {
        const bebida = await Bebida.findById(req.params.id);
        if (!bebida) {
            return res.status(404).json({ error: 'Bebida no encontrada' });
        }
        res.status(200).json(bebida);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar una bebida
router.put('/:id', async (req, res) => {
    try {
        const bebidaActualizada = await Bebida.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bebidaActualizada) {
            return res.status(404).json({ error: 'Bebida no encontrada' });
        }
        res.status(200).json(bebidaActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar una bebida
router.delete('/:id', async (req, res) => {
    try {
        const bebidaEliminada = await Bebida.findByIdAndDelete(req.params.id);
        if (!bebidaEliminada) {
            return res.status(404).json({ error: 'Bebida no encontrada' });
        }
        res.status(204).send(); // Sin contenido
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

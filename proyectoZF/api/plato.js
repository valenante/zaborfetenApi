const express = require('express');
const router = express.Router();
const Plato = require('../models/Plato'); // Ajusta la ruta según tu estructura de archivos

// Crear un nuevo plato
router.post('/', async (req, res) => {
    try {
        const nuevoPlato = new Plato(req.body);
        await nuevoPlato.save();
        res.status(201).json(nuevoPlato);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todos los platos
router.get('/', async (req, res) => {
    try {
        const platos = await Plato.find();
        res.status(200).json(platos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un plato por ID
router.get('/:id', async (req, res) => {
    try {
        const plato = await Plato.findById(req.params.id);
        if (!plato) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }
        res.status(200).json(plato);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un plato
router.put('/:id', async (req, res) => {
    try {
        const platoActualizado = await Plato.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!platoActualizado) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }
        res.status(200).json(platoActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un plato
router.delete('/:id', async (req, res) => {
    try {
        const platoEliminado = await Plato.findByIdAndDelete(req.params.id);
        if (!platoEliminado) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }
        res.status(204).send(); // Sin contenido
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

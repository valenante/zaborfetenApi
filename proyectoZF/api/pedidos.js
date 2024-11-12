const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido'); // Ajusta la ruta según tu estructura de archivos

// Crear un nuevo pedido
router.post('/', async (req, res) => {
    try {
        const nuevoPedido = new Pedido(req.body);
        await nuevoPedido.save();
        res.status(201).json({
            message: 'Pedido creado con éxito',
            pedidoId: nuevoPedido._id, // Incluir el ID del pedido creado
            pedido: nuevoPedido
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todos los pedidos
router.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.find();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener pedidos por ID de mesa
router.get('/mesa/:mesaId', async (req, res) => {
    try {
        const pedidos = await Pedido.find({ mesa: req.params.mesaId });
        if (!pedidos.length) {
            return res.status(404).json({ error: 'No se encontraron pedidos para esta mesa' });
        }
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un pedido por ID
router.get('/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un pedido
router.put('/:id', async (req, res) => {
    try {
        const pedidoActualizado = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pedidoActualizado) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json(pedidoActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un pedido
router.delete('/:id', async (req, res) => {
    try {
        const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);
        if (!pedidoEliminado) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(204).send(); // Sin contenido
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener pedidos pendientes
router.get('/pendientes', async (req, res) => {
    try {
        const pedidosPendientes = await Pedido.find({ estado: 'pendiente' });
        res.status(200).json(pedidosPendientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener pedidos finalizados
router.get('/finalizados', async (req, res) => {
    try {
        const pedidosFinalizados = await Pedido.find({ estado: 'finalizado' });
        res.status(200).json(pedidosFinalizados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un plato a un pedido específico
router.post('/:id/agregar-plato', async (req, res) => {
    const { platoId, nombre, cantidad, queso, acompanamiento, precios, especificaciones } = req.body; // Ajusta según los campos que necesitas
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        
        // Agregar el nuevo plato al array de productos
        pedido.productos.push({ platoId, nombre, cantidad, queso, acompanamiento, precios, especificaciones });
        
        // Actualizar el total del pedido (puedes agregar tu lógica para calcular el total)
        pedido.total += precios.precio * cantidad; // Asegúrate de ajustar esto según tu modelo de precios

        await pedido.save();
        res.status(200).json(pedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un plato de un pedido específico
router.delete('/:id/eliminar-plato/:platoId', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        
        // Filtrar el plato que se desea eliminar
        const productosActualizados = pedido.productos.filter(producto => producto.platoId !== req.params.platoId);

        // Actualizar el total del pedido (puedes agregar tu lógica para calcular el nuevo total)
        const platoEliminado = pedido.productos.find(producto => producto.platoId === req.params.platoId);
        if (platoEliminado) {
            pedido.total -= platoEliminado.precios.precio * platoEliminado.cantidad; // Ajustar según tu modelo
        }

        // Asignar los productos actualizados al pedido
        pedido.productos = productosActualizados;

        await pedido.save();
        res.status(200).json(pedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;

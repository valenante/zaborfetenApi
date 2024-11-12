const mongoose = require('mongoose');

const precioSchema = new mongoose.Schema({
    precio: { type: Number, default: null }, // Valor por defecto si no se proporciona
    racion: { type: Number, default: null }, // Valor por defecto de 1
    tapa: { type: Number, default: null } // Valor por defecto de 0
});

const opcionPersonalizableSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true
    },
    opciones: {
        type: [String], // Ejemplo: ["cheddar", "mozzarella"] para queso, ["patatas", "ensalada"] para acompañamiento
        // No requerido, ya que puede que no haya opciones disponibles
        default: [] // Un arreglo vacío por defecto
    }
});

const platoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precios: { type: precioSchema, required: true },
    ingredientes: { type: [String], required: true },
    opcionesPersonalizables: [opcionPersonalizableSchema],
    puntosDeCoccion: [{ 
        type: String,  // Este solo tiene el nombre del punto de cocción, ej. "Poco hecho", "Bien hecho"
        required: true 
      }],    
    especificaciones: { type: [String], default: [] },
    imagen: { type: String, required: true },
    categoria: { 
        type: String, 
        enum: ['especiales', 'carne', 'ensaladas', 'tapas', 'vegetarianos','mar', 'hambuguesas', 'postres'], 
        required: true 
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo'],
        default: 'activo'
    },
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Plato', platoSchema);

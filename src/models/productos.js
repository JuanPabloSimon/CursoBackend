const mongoose = require("mongoose");

const productosCollection = 'productos';

const ProductoSchema = new mongoose.Schema({
    nombre: {type: String, required: true, max: 100},
    descripcion: {type: String, required: true, max: 250},
    codigo: {type: Number, required: true},
    urlIMG: {type: String, required: true, max: 100},
    precio: {type: Number, required: true},
    stock: {type: Number, required: true}
})

const productoModel = mongoose.model(productosCollection, ProductoSchema);

module.exports = productoModel 
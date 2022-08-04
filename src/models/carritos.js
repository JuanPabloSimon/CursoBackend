const mongoose = require("mongoose");

const CarrritoCollection = "carritos";

const CarritoSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  cartId: { type: Number, required: true },
  productos: { type: Array, required: true },
});

const carritoModel = mongoose.model(CarrritoCollection, CarritoSchema);

module.exports = carritoModel;

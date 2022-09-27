const mongoose = require("mongoose");

const OrdenesCollection = "ordenes";

const OrdenesSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  numOrden: { type: Number, required: true },
  items: { type: Array, required: true },
  estado: { type: String, required: true },
  emailBuyer: { type: String, required: true },
});

const OrdenModel = mongoose.model(OrdenesCollection, OrdenesSchema);

module.exports = OrdenModel;

const mongoose = require("mongoose");
const mensajesCollection = "mensajes";

const MensajesSchema = new mongoose.Schema({
  email: { type: String, required: true, max: 100 },
  tipo: { type: String, required: true, max: 250 },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  mensaje: { type: String, required: true },
});

const mensajesModel = mongoose.model(mensajesCollection, MensajesSchema);

module.exports = mensajesModel;

const mongoose = require("mongoose");

// mongoose.connect(
//   "mongodb://localhost/ecommerce",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   () => console.log("Connected")
// );

const usuariosCollection = "usuarios";

const UsuarioSchema = new mongoose.Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  adress: { type: String, required: true, max: 100 },
  age: { type: Number, required: true },
  cartId: { type: Number, required: true },
  avatar: { type: String, required: false },
  phoneNumber: { type: Number, required: true },
  whatsApp: { type: Number, required: true },
});

module.exports = mongoose.model(usuariosCollection, UsuarioSchema);

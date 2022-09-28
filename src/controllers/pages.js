// Logger
const log4js = require("log4js");

log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    miLoggerError: { type: "file", filename: "error.log" },
  },
  categories: {
    default: { appenders: ["miLoggerConsole"], level: "info" },
    fileError: { appenders: ["miLoggerError"], level: "error" },
  },
});
const logger = log4js.getLogger();
const loggerError = log4js.getLogger("fileError");

//DOTENV
const dotenv = require("dotenv");
const path = require("path");
const NODE_ENV = process.argv.slice(2) || "desarrollo";
dotenv.config({
  path:
    NODE_ENV == "production"
      ? path.resolve(__dirname, "produccion.env")
      : path.resolve(__dirname, "desarrollo.env"),
});

//Containers

const { ProductosDaoMongo } = require("../daos/productos/ProductosDaoMongo");
let productsContainer = new ProductosDaoMongo();
const { CarritosDaoMongo } = require("../daos/carrito/CarritoDaoMongo");
let cartContainer = new CarritosDaoMongo();
const { OrdenesDaoMongo } = require("../daos/ordenes/OrdenesDaoMongo");
let ordenContainer = new OrdenesDaoMongo();
const { sendGmailPurchase } = require("../utils/sendGmail");
// Fuctions

function getRoot(req, res) {
  res.render("inicio");
}

async function getHome(req, res) {
  let usuario = req.user.firstName + " " + req.user.lastName;
  let email = req.user.username;
  let imagen = req.user.avatar;
  let products = await productsContainer.getContent();
  products.forEach((el) => {
    el.cartId = req.user.cartId;
  });
  res.render("principal", {
    usuario: usuario,
    email: email,
    avatar: imagen,
    productos: products,
  });
}

async function getCart(req, res) {
  let productsInCart = await cartContainer.getAllProducts(req.user.cartId);
  if (productsInCart) {
    productsInCart.forEach((el) => {
      el.cartId = req.user.cartId;
    });
  }
  res.render("carrito", { cartProducts: productsInCart });
}
let numero = 1;
async function sendCart(req, res) {
  let productos = await cartContainer.getAllProducts(req.user.cartId);
  cartContainer.deleteAllProducts(req.user.cartId);
  let timestamp = Date.now();
  let orden = {
    timestamp: timestamp,
    numOrden: numero,
    items: productos,
    estado: "generada",
    emailBuyer: req.user.username,
  };
  numero += 1;
  ordenContainer.save(orden);
  sendGmailPurchase(productos, req.user, "comprador");
  sendGmailPurchase(productos, req.user, "admin");
  res.redirect("productos");
}

function getConfig(req, res) {
  let datos = [
    { name: "Puerto", value: process.env.PORT },
    { name: "URLDB", value: process.env.MONGODB_URI },
    { name: "Tiempo sesion", value: process.env.TIME_SESSION },
    { name: "Email admin", value: process.env.EMAIL_ADMIN },
    { name: "Server mode", value: process.env.MODE },
    { name: "clientID", value: process.env.CLIENT_ID },
    { name: "clientSecret", value: process.env.CLIENT_SECRET },
  ];
  res.render("config", { datos: datos });
}

module.exports = {
  getRoot,
  sendCart,
  getHome,
  getCart,
  getConfig,
};

const express = require("express");
const { Router } = express;
const carritoRouter = Router();

// Logger (Log4js)

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

/* Guardado en Mongo */
const { CarritosDaoMongo } = require("../daos/carrito/CarritoDaoMongo");
let cartContainer = new CarritosDaoMongo();
const { ProductosDaoMongo } = require("../daos/productos/ProductosDaoMongo");
let productsContainer = new ProductosDaoMongo();

carritoRouter.post("/", async (req, res) => {
  let carrito = req.body;

  if (carrito) {
    carrito = await cartContainer.addCart();
    res.json({
      result: `Se creo el carrito con id: ${carrito.id}`,
      carrito: carrito,
    });
  }
});
carritoRouter.delete("/:id", async (req, res) => {
  await cartContainer.deleteById(req.params.id);
  res.json({ result: `Se elimino el carrito, id: ${req.params.id}` });
});
carritoRouter.get("/:id/productos", async (req, res) => {
  let carrito = await cartContainer.getAllProducts(req.params.id);
  res.json({ result: "Producos en carrito", productos: carrito });
});

carritoRouter.post("/:id/productos", async (req, res) => {
  let cartID = req.params.id;
  let producto = await productsContainer.getById(req.body.id);
  let product = {
    nombre: producto.nombre,
    codigo: producto.codigo,
    cantidad: 1,
    image: producto.urlIMG,
    precio: producto.precio,
    _id: producto._id,
  };
  console.log(product);

  if (cartID && product) {
    let carrito = await cartContainer.addProductToCart(cartID, product);
    res.redirect("/productos");
  } else {
    res.json({ result: "No se pudo agregar el producto" });
  }
});

//delete

carritoRouter.get("/:id/productos/:id_prod", (req, res) => {
  let cartID = req.params.id;
  let prodID = req.params.id_prod;
  if (cartID) {
    let carrito = cartContainer.deleteProduct(cartID, prodID);

    res.redirect("/carrito");
  } else {
    logger.error("Error con el pasaje de id de carrito");
  }
});

module.exports = carritoRouter;

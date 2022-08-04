const mongoose = require("mongoose");
const { ContainerMongo } = require("../../containers/ContainerMongo");
const carritoModel = require("../../models/carritos");

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

class CarritosDaoMongo extends ContainerMongo {
  constructor() {
    super(carritoModel);
    let carritos = this.getContent();
    this.id = carritos.length > 0 ? carritos.length + 1 : 1;
  }

  async addCart(id) {
    let timestamp = Date.now();
    let carrito = { timestamp: timestamp, cartId: id, productos: [] };
    this.save(carrito);
    return carrito._id;
  }

  async getAllProducts(id) {
    let carritos = await this.getContent();
    let product = null;
    if (carritos.length > 0) {
      let element = await this.modelo.findOne({ cartId: id });
      if (element) {
        product = element.productos;
        return product;
      } else {
        logger.warn("No se encontraron productos");
      }
    } else {
      logger.warn("No se encontró el carrito");
    }

    return product;
  }

  async addProductToCart(idCarrito, producto) {
    let item = await this.modelo.findOne(
      { cartId: idCarrito },
      { productos: 1 }
    );
    if (item) {
      let carrito = item.productos;
      carrito.push(producto);
      let dataUpdated = await this.modelo.updateOne(
        { cartId: idCarrito },
        { $set: { productos: carrito } }
      );
    } else {
      logger.error("Error al buscar carrito");
    }
  }

  async deleteProduct(idCarrito, idProd) {
    let item = await this.modelo.findOne({ cartId: idCarrito });
    if (item) {
      let producto = item.productos.find((prod) => prod._id == idProd);
      if (producto) {
        let productosUpdated = item.productos.filter(
          (elem) => elem._id != idProd
        );
        let dataUpdated = await this.modelo.updateOne(
          { carId: idCarrito },
          { $set: { productos: productosUpdated } }
        );
        return dataUpdated;
      } else {
        logger.warn("No se encontró el producto");
      }
    } else {
      logger.warn("No se agregaron productos");
    }
  }
  async deleteAllProducts(idCarrito) {
    let item = await this.modelo.findOne({ cartId: idCarrito });
    if (item) {
      let dataUpdated = await this.modelo.updateOne(
        { carId: idCarrito },
        { $set: { productos: [] } }
      );
      return dataUpdated;
    } else {
      logger.warn("No se encontraron productos");
    }
  }
}

module.exports = { CarritosDaoMongo };

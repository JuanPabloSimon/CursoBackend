const mongoose = require("mongoose");

// Logger

const log4js = require("log4js");

log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    miLoggerWarn: { type: "file", filename: "warn.log" },
    miLoggerError: { type: "file", filename: "error.log" },
  },
  categories: {
    default: { appenders: ["miLoggerConsole"], level: "info" },
    fileError: { appenders: ["miLoggerError"], level: "error" },
    warnError: { appenders: ["miLoggerWarn"], level: "warn" },
  },
});
const logger = log4js.getLogger();
const loggerError = log4js.getLogger("fileError");

// DOTENV

const dotenv = require("dotenv");
const path = require("path");
const NODE_ENV = process.argv.slice(2);
dotenv.config({
  path:
    NODE_ENV == "production"
      ? path.resolve(__dirname, "produccion.env")
      : path.resolve(__dirname, "desarrollo.env"),
});
const MONGO_URL = process.env.MONGO_URL;

class ContainerMongo {
  constructor(modelo) {
    mongoose.connect(
      "mongodb://localhost:27017/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => logger.info("Conectado a la base de datos")
    );
    this.modelo = modelo;
  }

  async save(data) {
    try {
      let documentSave = await new this.modelo(data).save();
      return documentSave;
    } catch (error) {
      logger.error(error);
      loggerError.error(error);
    }
  }

  async getContent() {
    try {
      let data = await this.modelo.find({}).lean();
      return data;
    } catch (error) {
      logger.error(error);
      loggerError.error(error);
    }
  }

  async getById(id) {
    try {
      let data = await this.modelo.find({ _id: id });
      let objeto = data.find((element) => element.id == id);
      return objeto;
    } catch (error) {
      logger.error(error);
      loggerError.error(error);
    }
  }

  async deleteById(id) {
    try {
      let dataDelete = await this.modelo.deleteOne({ _id: id });
      return { status: "Producto eliminado" };
    } catch (error) {
      logger.error(error);
      loggerError.error(error);
    }
  }

  async editData(id, data) {
    try {
      let dataUpdated = await this.modelo.updateOne(
        { _id: id },
        { $set: data }
      );
      return dataUpdated;
    } catch (error) {
      logger.error(error);
      loggerError.error(error);
    }
  }
}

module.exports = { ContainerMongo };

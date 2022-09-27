const { ContainerMongo } = require("../../containers/ContainerMongo");
const mensajesModel = require("../../models/mensajes");

class MensajesDaoMongo extends ContainerMongo {
  constructor() {
    super(mensajesModel);
  }
}

module.exports = { MensajesDaoMongo };

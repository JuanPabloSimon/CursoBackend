const { ContainerMongo } = require("../../containers/ContainerMongo");
const OrdenModel = require("../../models/ordenes");

class OrdenesDaoMongo extends ContainerMongo {
  constructor() {
    super(OrdenModel);
  }
}

module.exports = { OrdenesDaoMongo };

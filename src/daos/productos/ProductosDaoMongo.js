const { ContainerMongo } = require('../../containers/ContainerMongo');
const  productoModel  = require('../../models/productos')

class ProductosDaoMongo extends ContainerMongo {
    constructor() {
        super(productoModel)
    }
}

module.exports = { ProductosDaoMongo };
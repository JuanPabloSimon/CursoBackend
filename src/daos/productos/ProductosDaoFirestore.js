const { ContainerFirestore } = require('../../containers/ContainerFirestore')

class ProductosDaoFire extends ContainerFirestore {
    constructor() {
        super('productos')
    }
}

module.exports = { ProductosDaoFire };
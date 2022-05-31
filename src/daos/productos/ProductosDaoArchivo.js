const { ContainerArchivo } = require('../../containers/ContainerArchivo')

class ProductDaoFile extends ContainerArchivo {
    constructor() {
        super('./src/data/productos.json');
        let products = this.getContent();
        this.id = (products.length > 0 ) ? products.length + 1 : 1;
    }

    addProduct(data) {
        let products = this.getContent();
        let timestamp = Date.now()
        let product = {
            id: this.id,
            timestamp: timestamp,
            nombre: data.nombre,
            descripcion: data.descripcion,
            codigo: data.codigo,
            urlIMG: data.urlIMG,
            precio: data.precio,
            stock: data.stock
        }

        products.push(product);
        this.save(products)
        this.id++
    }


}

module.exports = { ProductDaoFile }
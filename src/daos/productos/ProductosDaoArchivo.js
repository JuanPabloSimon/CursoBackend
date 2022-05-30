const { ContainerArchivo } = require('../../containers/ContainerArchivo')

class ProductDaoFile extends ContainerArchivo {
    constructor() {
        super('./src/data/productos.json');
        let products = this.getAll();
        this.id = (products.length > 0 ) ? products.length + 1 : 1;
    }

    addProduct(nombre, descripcion, codigo, urlIMG, precio, stock) {
        let products = this.getAll();
        let timestamp = Date.now()
        let product = {
            id: this.id,
            timestamp: timestamp,
            nombre: nombre,
            descripcion: descripcion,
            codigo: codigo,
            urlIMG: urlIMG,
            precio: precio,
            stock: stock
        }

        products.push(product);
        this.save(products)
        this.id++;
    }

    getAll() {
        let products = this.getContent();
        return products;
    }


}

module.exports = { ProductDaoFile }
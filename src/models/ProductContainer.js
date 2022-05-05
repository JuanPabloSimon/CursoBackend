const { Container } = require('./Container');


class ProductContainer extends Container {
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

    getById(id) {
        let products = this.getAll();
        let product = null; 

        if (products.length > 0) {
            let element = products.find(prod => prod.id == id);
            if(element) {
                product = element;
            }
        }

        return product
    }

    editProd(id, nombre, descripcion, codigo, urlIMG, precio, stock) {
        let products = this.getAll();
        let product = null; 

        if (products.length > 0) {
            let element = products.find(prod => prod.id == id);
            if(element) {
                product = element;

                product = { 
                    id: product.id,
                    timestamp: product.timestamp,
                    nombre: nombre,
                    descripcion: descripcion,
                    codigo: codigo,
                    urlIMG: urlIMG,
                    precio: precio,
                    stock: stock
                }
            }
        }

        let productsUpdated = products.filter(prod => prod.id != id);
        productsUpdated.push(product);
        this.save(productsUpdated);
        return product;
    }

    deleteById(id) {
        let products = this.getAll();

        if (products.length > 0) {
            let element = products.find(prod => prod.id == id);
            if(element) {
                let prodUpdated = products.filter(prod => prod.id != id)

                this.save(prodUpdated)
            } else {
                console.log('No se encontro el producto');
            }
        }
    }


}

module.exports = { ProductContainer }
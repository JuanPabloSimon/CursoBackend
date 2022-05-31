const mongoose = require('mongoose')
const { ContainerMongo } = require('../../containers/ContainerMongo')
const carritoModel = require('../../models/carritos')


class CarritosDaoMongo extends ContainerMongo {
    constructor() {
        super(carritoModel)
        let carritos = this.getContent()
        this.id = (carritos.length > 0 ) ? carritos.length + 1 : 1;
    }

    async addCart() {
        let timestamp = Date.now();
        let carrito = {timestamp: timestamp, productos: []};
        this.save(carrito);
        return carrito
    }

    async getAllProducts(id) {
        let carritos = await this.getContent();
        let product = null; 
        if (carritos.length > 0) {
            let element = await this.modelo.findOne({_id: id});
            if(element) {
                product = element.productos;
                return product
            } else {
                console.log('No se encontraron productos');
            }
        } else {
            console.log('No se encontró el carrito');
        }

        return product
    }

    async addProductToCart(idCarrito, producto) {
        let item = await this.modelo.findOne(
            {_id: idCarrito},
            {productos:1}
            );
        console.log(item.productos);
        if(item) {
            let carrito = item.productos;
            carrito.push(producto);
            console.log(carrito);
            let dataUpdated = await this.modelo.updateOne(
                {_id: idCarrito},
                {$set: {productos: carrito}}
            );
            console.log(dataUpdated);
        } else {
            console.log('error');
        }
    }

    async deleteProduct(idCarrito, idProd) {
        let item = await this.modelo.findOne({_id: idCarrito});
        if(item) {
            let producto = item.productos.find(prod => prod._id == idProd) 
            console.log(producto);
            if(producto) {
                let productosUpdated = item.productos.filter(elem => elem._id != idProd);
                let dataUpdated = await this.modelo.updateOne(
                    {_id: idCarrito},
                    {$set: {productos: productosUpdated}}
                );
                console.log(dataUpdated);
                return dataUpdated
            } else {
                console.log('No se encontro el producto');
            }
        } else {
            console.log('No hay productos');
        }

        
    }
}

module.exports = { CarritosDaoMongo };
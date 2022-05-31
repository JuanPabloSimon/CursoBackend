const { ContainerFirestore } = require('../../containers/ContainerFirestore')

class CarritosDaoFire extends ContainerFirestore {
    constructor() {
        super('carritos')
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
            let element = await this.getById(`${id}`)
            if(element) {
                product = element.data.productos;
                console.log(product);
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
        let result = await this.collection.get()
        result = result.docs.map(doc => ({ 
        id: doc.id,
        data: doc.data()
        }))
        let item = result.find(elem => elem.id == idCarrito)
        
        if(item) {
            let carrito = item.data.productos;

            carrito.push(producto);
            let carritoUpdated = await this.collection.doc(`${idCarrito}`).update({productos: carrito})
            console.log(carritoUpdated);
            return await this.getById(idCarrito);
        } else {
            console.log('error');
        }
    }

    async deleteProduct(idCarrito, idProd) {
        let result = await this.collection.get()
        result = result.docs.map(doc => ({ 
        id: doc.id,
        data: doc.data()
        }))
        let item = result.find(elem => elem.id == idCarrito)
        
        if(item) {
            let producto = item.data.productos.find(prod => prod.id == idProd) 
            if(producto) {
                let productosUpdated = item.data.productos.filter(elem => elem.id != idProd);
                let carritoUpdated = await this.collection.doc(`${idCarrito}`).update({productos: productosUpdated})
                return carritoUpdated
            } else {
                console.log('No se encontro el producto');
            }
        } else {
            console.log('No hay productos');
        }

        
    }
}

module.exports = { CarritosDaoFire };
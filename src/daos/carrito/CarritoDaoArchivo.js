const { ContainerArchivo } = require('../../containers/ContainerArchivo') 

class CartDaoFile extends ContainerArchivo {
    constructor   () {
          super('./src/data/carrito.json')
          let carritos = this.getContent()
          this.id = (carritos.length > 0 ) ? carritos.length + 1 : 1;
    }


    addCart() {
        let carritos = this.getContent();
        let timestamp = Date.now();
        let carrito = {id: this.id, timestamp: timestamp, productos: []};
        carritos.push(carrito);
        this.save(carritos);
        this.id++;
        return carrito
    }


    getAllProducts(id) {
        let carritos = this.getContent();
        let product = null; 

        if (carritos.length > 0) {
            let element = carritos.find(prod => prod.id == id);
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

    addProductToCart(idCarrito, producto) {
        let carritos = this.getContent();
        let carrito = null;

        if(carritos.length > 0) {
            let element = carritos.find(elem => elem.id == idCarrito);
            if(element) {
                element.productos.push(producto);
                let carritosUpdated = carritos.filter(cart => cart.id != idCarrito)
                carritosUpdated.push({id: element.id, timestamp: element.timestamp, productos: element.productos})
                this.save(carritosUpdated);
                console.log(carritosUpdated);
            } else {
                console.log('error');
            }
        } else {
            console.log('error2');
        }
    }

    deleteProduct(idCarrito, idProd) {
        let carritos = this.getContent();
        if(carritos.length > 0) {
            let element = carritos.find(elem => elem.id == idCarrito);
            if(element) {
                let producto = element.productos.find(prod => prod.id == idProd) 
                if(producto) {
                    let productosUpdated = element.productos.filter(elem => elem.id != idProd);
                    let carritoUpdated = {id: element.id, timestamp: element.timestamp, productos: productosUpdated }
                    let carritosUpdated = carritos.filter(cart => cart.id != idCarrito)
                    carritosUpdated.push(carritoUpdated)
                    this.save(carritosUpdated)
                    return carritoUpdated

                } else {
                    console.log('No se encontro el producto');
                }
            } else {
                console.log('No hay productos');
            }

        }
    }
}

module.exports = { CartDaoFile }
const { Container } = require('./Container')

class CartContainer extends Container {
    constructor   () {
          super('./src/data/carrito.json')
          let carritos = this.getAll()
          this.id = (carritos.length > 0 ) ? carritos.length + 1 : 1;
    }

    getAll() {
        let carritos = this.getContent();
        return carritos
    }

    addCart() {
        let carritos = this.getAll();
        let timestamp = Date.now();
        let carrito = {id: this.id, timestamp: timestamp, productos: []};
        carritos.push(carrito);
        this.save(carritos);
        this.id++;
        return carrito
    }

    deleteCart(id) {
        let carritos = this.getAll();

        if (carritos.length > 0) {
            let element = carritos.find(cart => cart.id == id);
            if(element) {
                let cartsUpdated = carritos.filter(prod => prod.id != id)

                this.save(cartsUpdated)
            } else {
                console.log('No se encontro el producto');
            }
        }
    }

    getAllProducts(id) {
        let carritos = this.getAll();
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

    addProduct(idCarrito, producto) {
        let carritos = this.getAll();
        let carrito = null;

        if(carritos.length > 0) {
            let element = carritos.find(elem => elem.id == idCarrito);
            if(element) {
                element.productos.push(producto);
                carrito = element;
            }

            this.save(carritos)
        }

        return carrito;
    }

    deleteProduct(idCarrito, idProd) {
        let carritos = this.getAll();
        if(carritos.length > 0) {
            let element = carritos.find(elem => elem.id == idCarrito);
            if(element.productos.length > 0) {
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

module.exports = { CartContainer }
const { response } = require('express');
const express = require('express');
const { Router } = express;
const carritoRouter = Router();

/* Guardado en archivos */

// const { CartDaoFile } = require('../daos/carrito/CarritoDaoArchivo');
// const { ProductDaoFile } = require('../daos/productos/ProductosDaoArchivo');
// let productsContainer = new ProductDaoFile();
// let cartContainer = new CartDaoFile();

/* Guardado en Firebase */

// const { CarritosDaoFire } = require('../daos/carrito/CarritoDaoFirestore')
// let cartContainer = new CarritosDaoFire();
// const { ProductosDaoFire } = require('../daos/productos/ProductosDaoFirestore')
// let productsContainer = new ProductosDaoFire();


/* Guardado en Mongo */
const { CarritosDaoMongo } = require('../daos/carrito/CarritoDaoMongo')
let cartContainer = new CarritosDaoMongo()
const { ProductosDaoMongo } = require('../daos/productos/ProductosDaoMongo')
let productsContainer = new ProductosDaoMongo()


carritoRouter.post('/', async (req, res) => {
    let carrito = req.body

    if(carrito) {
        carrito = await cartContainer.addCart()
        res.json({result: `Se creo el carrito con id: ${carrito.id}`, carrito: carrito})
    }
})
carritoRouter.delete('/:id', async (req, res) => {
    await cartContainer.deleteById(req.params.id);
    res.json({result: `Se elimino el carrito, id: ${req.params.id}`})
})
carritoRouter.get('/:id/productos', async (req, res) => {
    let carrito = await cartContainer.getAllProducts(req.params.id);
    res.json({result:'Producos en carrito', productos: carrito});
})
carritoRouter.post('/:id/productos', async (req, res) => {
    let cartID = req.params.id;
    let producto = await productsContainer.getById(req.body.id)
    

    if(cartID && producto) {
        let carrito = await cartContainer.addProductToCart(cartID, producto);

        res.json({result: 'Producto agregado al carrito', carrito: carrito});
    } else {
        res.json({result: 'No se pudo agregar el producto'})
    }
}) 
carritoRouter.delete('/:id/productos/:id_prod', (req, res) => {
    let cartID = req.params.id;
    let prodID = req.params.id_prod

    if(cartID) {
        let carrito = cartContainer.deleteProduct(cartID, prodID)

        res.json({result: 'Producto eliminado', carrito: carrito})
    } else {
        res.json({result: 'No se pudo eliminar el producto deseado'})
    }
})

module.exports = carritoRouter;
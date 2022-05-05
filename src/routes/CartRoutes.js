const { response } = require('express');
const express = require('express');
const { Router } = express;
const carritoRouter = Router();

const { CartContainer } = require('../models/CartContainer');
const { ProductContainer } = require('../models/ProductContainer');
let productsContainer = new ProductContainer();
let cartContainer = new CartContainer();


carritoRouter.post('/', (req, res) => {
    let carrito = req.body

    if(carrito) {
        carrito = cartContainer.addCart()
        res.json({result: `Se creo el carrito con id: ${carrito.id}`, carrito: carrito})
    }
})
carritoRouter.delete('/:id', (req, res) => {
    cartContainer.deleteCart(req.params.id);
    res.json({result: `Se elimino el carrito, id: ${req.params.id}`})
})
carritoRouter.get('/:id/productos', (req, res) => {
    let carrito = cartContainer.getAllProducts(req.params.id);
    res.json({result:'Producos en carrito', productos: carrito});
})
carritoRouter.post('/:id/productos', (req, res) => {
    let cartID = req.params.id;
    let producto = productsContainer.getById(req.body.id)

    if(cartID && producto) {
        let carrito = cartContainer.addProduct(cartID, producto);

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
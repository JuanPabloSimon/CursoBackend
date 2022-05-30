const express = require('express');
const { Router } = express;
const productosRouter = Router();

const { ProductDaoFile } = require('../daos/productos/ProductosDaoArchivo')
let productsContainer = new ProductDaoFile();

productosRouter.get('/', (req, res) => {
    let products = productsContainer.getAll();
    res.json({productos: products});
})
productosRouter.get('/:id', (req, res) => {
    let product = productsContainer.getById(req.params.id);
    res.json({producto: product})
})
productosRouter.post('/', (req, res) => {
    let producto = req.body;

    if (producto && producto.nombre && producto.descripcion && producto.codigo && producto.precio && producto.stock ) {
        producto = productsContainer.addProduct(producto.nombre, producto.descripcion, producto.codigo, producto.urlIMG, producto.precio, producto.stock);
        res.json({result: 'producto guardado', producto: producto})
    } else {
        res.json({result: 'El producto no pudo ser guardado'})
    }
})
productosRouter.put('/:id', (req, res) => {
    let producto = req.body;

    if (producto && producto.nombre && producto.descripcion && producto.codigo && producto.precio && producto.stock ) {
        producto = productsContainer.editProd(req.params.id, producto);
        res.json({result: 'producto editado', producto: producto})
    } else {
        res.json({result: 'El producto no pudo ser editado'})
    }
})
productosRouter.delete('/:id', (req, res) => {
    productsContainer.deleteById(req.params.id);
    res.json({result: `Producto con id: ${req.params.id} eliminado`});
})


module.exports = productosRouter;
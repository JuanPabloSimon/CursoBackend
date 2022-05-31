const express = require('express');
const { Router } = express;
const productosRouter = Router();


/* Guardado en archivos */

// Al usar este metodo se debe implementar en la ruta post la funcion addProduct(). de lo contrario dejar save().

// const { ProductDaoFile } = require('../daos/productos/ProductosDaoArchivo')
// let productsContainer = new ProductDaoFile();

/* Guardado en Firebase */

// const { ProductosDaoFire } = require('../daos/productos/ProductosDaoFirestore')
// let productsContainer = new ProductosDaoFire();

/* Guardado en Mongo */
const { ProductosDaoMongo } = require('../daos/productos/ProductosDaoMongo')
let productsContainer = new ProductosDaoMongo()


productosRouter.get('/', async (req, res) => {
    let products =  await productsContainer.getContent();
    res.json({productos: products});
})
productosRouter.get('/:id', async (req, res) => {
    let product = await productsContainer.getById(req.params.id);
    res.json({producto: product})
})
productosRouter.post('/', async (req, res) => {
    let data = req.body;

    if (data && data.nombre && data.descripcion && data.codigo && data.precio && data.stock ) {
        let product = await productsContainer.save(data);
        res.json({result: 'producto guardado', product: product})
    } else {
        res.json({result: 'El producto no pudo ser guardado'})
    }
})
productosRouter.put('/:id', async (req, res) => {
    let data = req.body;

    if (data) {
        let producto = await productsContainer.editData(req.params.id, data);
        res.json({result: 'producto editado', producto: producto})
    } else {
        res.json({result: 'El producto no pudo ser editado'})
    }
})
productosRouter.delete('/:id', async (req, res) => {
    await productsContainer.deleteById(req.params.id);
    res.json({result: `Producto con id: ${req.params.id} eliminado`});
})


module.exports = productosRouter;
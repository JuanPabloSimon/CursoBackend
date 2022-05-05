const express = require('express');
const app = express();
const carritoRouter = require('./src/routes/CartRoutes')
const productosRouter = require('./src/routes/ProductRoutes')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritoRouter);

app.listen(8080, () => {
    console.log('Server escuchando en puerto 8080');
})
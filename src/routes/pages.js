const { Router } = require("express");
const routes = require("../controllers/pages");
const routes2 = require("../controllers/session");
const passport = require("passport");

const pagesRouter = Router();
// Inicio
pagesRouter.get("/", routes.getRoot);

// Envio carrito
pagesRouter.post("/enviar", routes.sendCart);

// Home
pagesRouter.get("/productos", routes2.checkAuthentication, routes.getHome);
pagesRouter.get("/carrito", routes2.checkAuthentication, routes.getCart);

module.exports = pagesRouter;

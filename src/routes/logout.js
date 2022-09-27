const { Router } = require("express");
const routes = require("../controllers/session");
const passport = require("passport");

const logoutRouter = Router();

// LogOut
logoutRouter.get("/", routes.getLogout);

module.exports = logoutRouter;

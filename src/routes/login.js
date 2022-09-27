const { Router } = require("express");
const routes = require("../controllers/session");
const passport = require("passport");

const loginRouter = Router();
// Login3
loginRouter.get("/", routes.getLogin);
loginRouter.post(
  "/",
  passport.authenticate("login", { failureRedirect: "/login" }),
  routes.postLogin
);

module.exports = loginRouter;

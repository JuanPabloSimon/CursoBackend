const { Router } = require("express");
const routes = require("../controllers/session");
const passport = require("passport");

const signupRouter = Router();

// Signup
signupRouter.get("/", routes.getSignUp);
signupRouter.post(
  "/",
  passport.authenticate("signup", { failureRedirect: "/signup" }),
  routes.postSignup
);

module.exports = signupRouter;

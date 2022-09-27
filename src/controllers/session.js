const { CarritosDaoMongo } = require("../daos/carrito/CarritoDaoMongo");
let cartContainer = new CarritosDaoMongo();
const { sendGmailNewUser } = require("../utils/sendGmail");
function getLogin(req, res) {
  res.render("login");
}

function postLogin(req, res) {
  if (req.isAuthenticated()) {
    usuario = {
      email: req.user.username,
      tipo: req.user.type,
    };
    res.redirect("productos");
  } else {
    res.redirect("login");
  }
}

function getSignUp(req, res) {
  res.render("signup");
}

async function postSignup(req, res) {
  if (req.isAuthenticated()) {
    carritoID = await cartContainer.addCart(req.user.cartId, req.user.adress);
    sendGmailNewUser(req.user);
    res.redirect("productos");
  } else {
    res.redirect("login");
  }
}

function getLogout(req, res) {
  let usuario = req.user.firstName;
  req.logout((err) => {
    if (!err) {
      res.render("logout", { usuario: usuario });
    }
  });
}

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = {
  getLogin,
  getSignUp,
  getLogout,
  postLogin,
  postSignup,
  checkAuthentication,
};

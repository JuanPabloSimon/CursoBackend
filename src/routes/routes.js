const { CarritosDaoMongo } = require("../daos/carrito/CarritoDaoMongo");
let cartContainer = new CarritosDaoMongo();

// Email Con Nodemailer y Gmail

const nodemailer = require("nodemailer");
const TEST_GMAIL_ADMIN = "pruebacoder8@gmail.com";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: TEST_GMAIL_ADMIN,
    type: "OAuth2",
    clientId:
      "748545006353-cqu59dnrh437t7bdsue5ae1pnpdshe94.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//04SYmA7laW1RDCgYIARAAGAQSNgF-L9IrNH5MgObG0Kew0_6Ni8LIUyTV1s3hhJgGX5D2uMIG4o8JEDo5usYAZjvzT120wOwyqQ",
    accessToken:
      "ya29.A0AVA9y1sDjAz2oOi8hzfsSAoK2CCZ1GssYsfucsdWqk4Ng_oKmDLHe0EK-NFJ_Im49q9Uqcvj6c7Qhfa-pY3uzlx1Ha-kaM4_NlhOCnn873jw06HzjS_yJlRVYe2EsKqCwDCRigpRTQAY4_6NWhP1uFxMJKIhYUNnWUtBVEFTQVRBU0ZRRTY1ZHI4ckRqTnB5ZEpuWDlYLThKTDdVZjdIZw0163",
  },
});

async function sendGmailNewUser(usuario) {
  const mailOptions = {
    from: "Servidor de node.js",
    to: TEST_GMAIL_ADMIN,
    subject: "Nuevo Usuario Registrado",
    html: `<h2 style="color:green"> Nombre: ${usuario.firstName} ${usuario.lastName}</h2><br/><p> Usuario: ${usuario.username}</p><br/><p> Contraseña: ${usuario.password}</p><br/><p> Dirección: ${usuario.adress}</p><br/><p> Edad: ${usuario.age}</p><br/><p> Numero celular: ${usuario.phoneNumber}</p>`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(info);
  } catch (error) {
    logger.error(error);
    loggerError.error(error);
  }
}

async function sendGmailBuyer(productos, usuario) {
  const html = productos
    .map((elem) => {
      return `<div>
                <strong>${elem.nombre}: </strong>
                <strong>$${elem.precio}</strong>
            </div>`;
    })
    .join(" ");
  const mailOptions = {
    from: "Servidor de node.js",
    to: usuario.username,
    subject: "Pedido Enviado y recibido",
    html:
      `<h2> Recibimos tu pedido ${usuario.firstName} ${usuario.lastName}, los productos que agregaste fueron: </h2>` +
      html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(info);
  } catch (error) {
    logger.error(error);
    loggerError.error(error);
  }
}

async function sendGmailAdmin(productos, usuario) {
  const html = productos
    .map((elem) => {
      return `<div>
                <strong> Nombre: ${elem.nombre} - </strong>
                <strong> Precio: $${elem.precio} - </strong>
                <strong> Código: ${elem.codigo}</strong>
            </div>`;
    })
    .join(" ");
  const mailOptions = {
    from: "Servidor de node.js",
    to: TEST_GMAIL_ADMIN,
    subject: "Nuevo Pedido",
    html:
      `<h2> Nuevo Pedido de: ${usuario.firstName} ${usuario.lastName} </h2>
    <p> Usuario: ${usuario.username} - Telefono: ${usuario.phoneNumber} </p>
    <p> Usuario: Dirección: ${usuario.adress}</p>
    <h3> Productos: </h3>` + html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(info);
  } catch (error) {
    logger.error(error);
    loggerError.error(error);
  }
}

//  Mensajes con twilio
const twilio = require("twilio");
const { logger } = require("handlebars");
const ACCOUNT_SID = "ACd48339c14357d43c2dbb7bad8a22a959";
const AUTH_TOKEN = "b18645b3a82150ee10e5ce4be78f00fc";

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

async function sendSMS(usuario) {
  try {
    const message = client.messages.create({
      body: "Gracias por elegirnos! Su pedido ya está en proceso",
      from: "+13155443754",
      to: "+" + usuario.phoneNumber,
    });
  } catch (error) {
    logger.error(error);
    loggerError.error(error);
  }
}
// Mensaje de WhatsApp Con Twilio

async function sendWsp(usuario) {
  try {
    const message = client.messages.create({
      body: "Gracias por elegirnos! Su pedido ya está en proceso",
      from: "whatsapp:+14155238886",
      to: "whatsapp:+" + usuario.whatsApp,
    });
  } catch (error) {
    logger.error(error);
    loggerError.error(error);
  }
}

// Rutas

function getRoot(req, res) {
  res.render("inicio");
}

function getLogin(req, res) {
  res.render("login");
}

function postLogin(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("home");
  } else {
    res.redirect("login");
  }
}

function getSignUp(req, res) {
  res.render("signup");
}

async function postSignup(req, res) {
  if (req.isAuthenticated()) {
    carritoID = await cartContainer.addCart(req.user.cartId);
    sendGmailNewUser(req.user);

    res.redirect("home");
  } else {
    res.redirect("login");
  }
}

async function sendCart(req, res) {
  let productos = await cartContainer.getAllProducts(req.user.cartId);
  cartContainer.deleteAllProducts(req.user.cartId);
  sendGmailBuyer(productos, req.user);
  sendGmailAdmin(productos, req.user);
  sendSMS(req.user);
  sendWsp(req.user);
  res.redirect("home");
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
  getRoot,
  getLogin,
  getSignUp,
  getLogout,
  postLogin,
  postSignup,
  checkAuthentication,
  sendCart,
};

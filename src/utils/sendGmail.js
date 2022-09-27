// Logger
const log4js = require("log4js");

log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    miLoggerError: { type: "file", filename: "error.log" },
  },
  categories: {
    default: { appenders: ["miLoggerConsole"], level: "info" },
    fileError: { appenders: ["miLoggerError"], level: "error" },
  },
});
const logger = log4js.getLogger();
const loggerError = log4js.getLogger("fileError");

// DOTENV
const dotenv = require("dotenv");
const path = require("path");
const NODE_ENV = process.argv.slice(2);
dotenv.config({
  path:
    NODE_ENV == "production"
      ? path.resolve(__dirname, "produccion.env")
      : path.resolve(__dirname, "desarrollo.env"),
});

// Email Con Nodemailer y Gmail

const nodemailer = require("nodemailer");
const TEST_GMAIL_ADMIN = process.env.EMAIL_ADMIN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: TEST_GMAIL_ADMIN,
    type: "OAuth2",
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: ACCESS_TOKEN,
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

async function sendGmailPurchase(productos, usuario, receptor) {
  if (receptor == "comprador") {
    const html = productos
      .map((elem) => {
        return `<div>
                    <strong>${elem.nombre}: </strong>
                    <strong>$${elem.precio}</strong>
                    <strong>x${elem.cantidad} unidades. Precio final= $${
          elem.precio * elem.cantidad
        }
        </strong>
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
  } else if (receptor == "admin") {
    const html = productos
      .map((elem) => {
        return `<div>
                    <strong> Nombre: ${elem.nombre} - </strong>
                    <strong> Precio: $${elem.precio} - </strong>
                    <strong> Código: ${elem.codigo} - </strong>
                    <strong> Cantidad: ${elem.cantidad}</strong>

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
}

module.exports = {
  sendGmailNewUser,
  sendGmailPurchase,
};

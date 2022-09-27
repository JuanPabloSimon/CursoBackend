const express = require("express");
const app = express();
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const handlebars = require("express-handlebars");
const dotenv = require("dotenv");
const path = require("path");
const ENV = process.argv.slice(2);
dotenv.config({
  path:
    ENV == "production"
      ? path.resolve(__dirname, "produccion.env")
      : path.resolve(__dirname, "desarrollo.env"),
});
const PORT = process.env.PORT || 8080;

const { MensajesDaoMongo } = require("./src/daos/mensajes/MensajesDaoMongo");
let messageContainer = new MensajesDaoMongo();
// Inicializando
const cluster = require("cluster");
const MODE = process.env.MODE;
if (MODE === "cluster") {
  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    httpServer.listen(PORT, () => {
      logger.info(`Server corriendo en puerto: ${PORT} en modo cluster`);
    });
  }
} else {
  httpServer.listen(PORT, () => {
    logger.info("Server escuchando en puerto 8080");
  });
}
// Logger (Log4js)
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
// Passport
const session = require("express-session");
const UserModel = require("./src/models/usuarios");
const { createHash } = require("./src/utils/hashGenerator");
const { validatePass } = require("./src/utils/passValidator");
const { getRandomNumber } = require("./src/utils/getRandomNumber");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const time = parseInt(process.env.TIME_SESSION);
app.use(
  session({
    secret: "finalProyect",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: time,
    },
    rolling: true,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  "login",
  new LocalStrategy((username, password, callback) => {
    UserModel.findOne({ username: username }, (err, user) => {
      if (err) {
        return callback(err);
      }

      if (!user) {
        logger.warn("El usuario no se encuentra registrado");
        return callback(null, false);
      }

      if (!validatePass) {
        logger.warn("Contraseña Incorrecta");
        return callback(null, false);
      }

      return callback(null, user);
    });
  })
);
passport.use(
  "signup",
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, callback) => {
      UserModel.findOne({ username: username }, (err, user) => {
        if (err) {
          logger.error(err);
          loggerError.error(err);
          return callback(err);
        }

        if (user) {
          logger.warn("El usuario ya se encuentra registrado");
          return callback(null, false);
        }

        if (password !== req.body.password2) {
          logger.warn("Las contraseñas no coinciden");
          return callback(null, false);
        }

        if (username === "admin@gmail.com") {
          const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: username,
            password: createHash(password),
            adress: req.body.adress,
            age: req.body.age,
            cartId: getRandomNumber(),
            phoneNumber: req.body.codeInt + req.body.phone,
            whatsApp: req.body.codeInt + "9" + req.body.phone,
            type: "sistema",
          };
          UserModel.create(newUser, (err, userWithId) => {
            if (err) {
              return callback(err);
            }

            logger.info("Registro Satisfactorio");
            logger.info(userWithId);
            return callback(null, userWithId);
          });
        } else {
          const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: username,
            password: createHash(password),
            adress: req.body.adress,
            age: req.body.age,
            cartId: getRandomNumber(),
            phoneNumber: req.body.codeInt + req.body.phone,
            whatsApp: req.body.codeInt + "9" + req.body.phone,
            type: "usuario",
          };
          UserModel.create(newUser, (err, userWithId) => {
            if (err) {
              return callback(err);
            }

            logger.info("Registro Satisfactorio");
            logger.info(userWithId);
            return callback(null, userWithId);
          });
        }
      });
    }
  )
);
passport.serializeUser((user, callback) => {
  callback(null, user._id);
});
passport.deserializeUser((id, callback) => {
  UserModel.findById(id, callback);
});
// Handlebars and middlewares
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/src/views/layouts",
    partialsDir: __dirname + "/src/views/partials/",
  })
);

app.set("view engine", "hbs");
app.set("views", "./src/views");
app.use(express.static("./public/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io
const routes = require("./src/controllers/session");
let email = "";
let tipo = "";
app.get("/chat", routes.checkAuthentication, (req, res) => {
  email = req.user.username;
  tipo = req.user.type;
  res.render("chat");
});
io.on("connection", (socket) => {
  console.log("Cliente conectado");
  let messages = [];
  async function getMessages() {
    messages = await messageContainer.getContent();
    socket.emit("messages", messages);
  }
  getMessages();
  socket.on("new-message", (data) => {
    let mensaje = {
      mensaje: data.mensaje,
      email: email,
      fecha: data.fecha,
      hora: data.hora,
      tipo: tipo,
    };
    messageContainer.save(mensaje);

    console.log("Mensaje enviado: " + data.mensaje);
    io.sockets.emit("messages", mensaje);
  });
});

// Rutas
const carritoRouter = require("./src/routes/CartRoutes");
const productosRouter = require("./src/routes/ProductRoutes");
const signupRouter = require("./src/routes/signup");
const loginRouter = require("./src/routes/login");
const logoutRouter = require("./src/routes/logout");
const pagesRouter = require("./src/routes/pages");

app.use(pagesRouter);
app.use("/api/productos", productosRouter);
app.use("/api/carrito", carritoRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/signup", signupRouter);

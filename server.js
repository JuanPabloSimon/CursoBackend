const express = require("express");
const app = express();
const carritoRouter = require("./src/routes/CartRoutes");
const productosRouter = require("./src/routes/ProductRoutes");
const handlebars = require("express-handlebars");
const PORT = process.env.PORT || 8080;

const routes = require("./src/routes/routes");

// Inicializando

const cluster = require("cluster");
const MODE = process.env.MODE || "fork";

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
    app.listen(PORT, () => {
      logger.info(`Server corriendo en puerto: ${PORT} en modo cluster`);
    });
  }
} else {
  app.listen(PORT, () => {
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

// Mongo (Productos)

const { ProductosDaoMongo } = require("./src/daos/productos/ProductosDaoMongo");
let productsContainer = new ProductosDaoMongo();
const { CarritosDaoMongo } = require("./src/daos/carrito/CarritoDaoMongo");
let cartContainer = new CarritosDaoMongo();

// Passport

const session = require("express-session");
const UserModel = require("./src/models/usuarios");
const { createHash } = require("./src/utils/hashGenerator");
const { validatePass } = require("./src/utils/passValidator");
const { getRandomNumber } = require("./src/utils/getRandomNumber");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

app.use(
  session({
    secret: "entregable",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 6000000,
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

        const newUser = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: username,
          password: createHash(password),
          adress: req.body.adress,
          age: req.body.age,
          avatar: linkAvatar,
          cartId: getRandomNumber(),
          phoneNumber: req.body.codeInt + req.body.phone,
          whatsApp: req.body.codeInt + "9" + req.body.phone,
        };

        UserModel.create(newUser, (err, userWithId) => {
          if (err) {
            return callback(err);
          }

          logger.info("Registro Satisfactorio");
          logger.info(userWithId);
          return callback(null, userWithId);
        });
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
app.use(express.static("./public/assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public/assets/" });

//Graphql
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const schema = buildSchema(`
  type Producto {
    nombre: String!
    descripcion: String!
    codigo: Int!
    urlIMG: String
    precio: Int!
    stock: Int!
  }
  input ProductoInput {
    nombre: String!
    descripcion: String!
    codigo: Int!
    urlIMG: String
    precio: Int!
    stock: Int!
  }
  type Query {
    getProducts: [Producto]
    getById(id: Int!): Producto
  }
  type Mutation {
    createProduct(datos: ProductoInput): Producto
    updateProduct(id: Int!, datos: ProductoInput): Producto
    deleteProduct(id: Int!): Producto
  }
`);

async function getProducts() {
  let response = await productsContainer.getContent();
  return response;
}

async function getById(id) {
  let response = await productsContainer.getById(id);
  return response;
}

async function createProduct(datos) {
  let response = await productsContainer.save(datos);
  return response;
}

async function updateProduct(id, datos) {
  let response = await productsContainer.editData(id, datos);
  return response;
}

async function deleteProduct(id) {
  let response = await productsContainer.deleteById(id);
  return response;
}
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: {
      getProducts,
      getById,
      updateProduct,
      createProduct,
      deleteProduct,
    },
    graphiql: true,
  })
);

// Rutas

app.use("/api/productos", productosRouter);
app.use("/api/carrito", carritoRouter);
// Inicio

app.get("/", routes.getRoot);

// Login

app.get("/login", routes.getLogin);

app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  routes.postLogin
);

// Signup
let linkAvatar = "";
app.post("/uploadImage", upload.single("myFile"), (req, res) => {
  fs.renameSync(
    req.file.path,
    req.file.path + "." + req.file.mimetype.split("/")[1]
  );
  linkAvatar = `${req.file.filename}.jpeg`;
  res.redirect("/signup");
});

app.get("/signup", routes.getSignUp);

app.post(
  "/signup",
  passport.authenticate("signup", { failureRedirect: "/signup" }),
  routes.postSignup
);

// Envio carrito

app.post("/enviar", routes.sendCart);

// LogOut

app.get("/logout", routes.getLogout);

// Home

app.get("/home", routes.checkAuthentication, async (req, res) => {
  let usuario = req.user.firstName + " " + req.user.lastName;
  let email = req.user.username;
  let imagen = req.user.avatar;
  let products = await productsContainer.getContent();
  products.forEach((el) => {
    el.cartId = req.user.cartId;
  });
  let productsInCart = await cartContainer.getAllProducts(req.user.cartId);
  if (productsInCart) {
    productsInCart.forEach((el) => {
      el.cartId = req.user.cartId;
    });
  }
  res.render("principal", {
    usuario: usuario,
    email: email,
    avatar: imagen,
    productos: products,
    cartProducts: productsInCart,
  });
});

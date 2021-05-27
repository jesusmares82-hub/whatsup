const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const logger = require("morgan");
const models = require("./models");
const routes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../swagger.json");
const fs = require("fs");
var https = require("https");
require("dotenv").config();

//Middlewares
app.use(cors()); //Implementará CORS en el servidor
app.use(helmet()); // Implementará Helmet en el servidor
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(
  logger("combined", {
    stream: fs.createWriteStream("./access.log", { flags: "a" }),
  })
);
app.use(
  logger("combined", {
    stream: fs.createWriteStream("./access.log", { flags: "a" }),
  })
);
app.set("port", process.env.PORT || 8080);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json({ api: "1.0.0" });
});

app.use("/api/v1", routes.authRoutes, routes.roomRoutes);

//Middleware para manejar errores
app.use((err, req, res, next) => {
  console.log(err.stack);
  switch (err.name) {
    case "":
      const errObj = { message: "Validation Error", errors: [] };
      err.errors.map((er) => {
        errObj.errors.push({ [er.path]: er.message });
      });
      return res.status(403).send(errObj);
    case "SequelizeUniqueConstraintError":
      return res
        .status(403)
        .send({ message: "Ya existe un registro con el mismo valor" });

    default:
      console.log(err);
      return res
        .status(500)
        .send(
          `Ups tenemos un problema en el servidor, intentalo más tarde! ${err} `
        );
  }
});

models.sequelize.authenticate().then(
  () => console.log(`Sequelize connected to database`),
  (err) => console.error("Unable to connect to the database:", err)
);

module.exports = app;

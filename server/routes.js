const express = require("express");
const routes = express.Router();
const SocietyController = require("./controllers/SocietyController");

routes.get("/", SocietyController.list);
routes.get("/entreprise", SocietyController.findByName);
routes.get("/entreprise/:id", SocietyController.findById);

module.exports = routes;
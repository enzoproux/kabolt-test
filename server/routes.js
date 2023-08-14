const express = require("express");
const routes = express.Router();
const SocietyController = require("./controllers/SocietyController");

routes.get("/entreprises", SocietyController.list);
routes.get("/entreprise", SocietyController.findByName);
routes.get("/entreprise/:id", SocietyController.findById);
routes.get("/entreprise/pdf/:id", SocietyController.getSocietyPagePdf);

module.exports = routes;
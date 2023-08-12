const express = require("express");
const routes = express.Router();
const SocietyController = require("./controllers/SocietyController");

routes.get("/", SocietyController.list);
routes.get("/society", SocietyController.findByName);
routes.get("/society/:id", SocietyController.findById);

module.exports = routes;
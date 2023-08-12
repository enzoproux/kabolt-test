const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const config = require('config');
const server = config.get('server');
const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.listen(server.port, () => {
  console.log(`App listening on port ${server.port}`)
})
const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const config = require('config');
const database = config.get('database');
const request = config.get('request');

//Init DB connection
const knex = require('knex')({
  client: database.client,
  connection: {
    host : database.host,
    user : database.user,
    password : database.password,
    database : database.name
  }
});

app.use(cors())

//Get a society
app.get('/society/:name?',  (req, res) => {
  console.log(req.params.name);
  let page = req.query.page? req.query.page : 1;

  if(req.params.name !== undefined){
     knex.select('siren', 'nom_complet', 'date_creation')
      .from('entreprise')
      .offset((page - 1) * request.limit)
      .limit(request.limit)
      .whereILike('nom_complet', '%' + req.params.name + '%')
      .then(data => res.send(data));
  }else{
     knex.select('siren', 'nom_complet', 'date_creation')
      .from('entreprise')
      .offset((page - 1) * request.limit)
      .limit(request.limit)
      .then(data => res.send(data));
  }  
})

//Get a society by siren
app.get('/society/:siren',  (req, res) => {

    knex.select('siren', 'nom_complet', 'date_creation')
      .from('entreprise')
      .where('siren', req.params.siren)
      .then(data => res.send(data));
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
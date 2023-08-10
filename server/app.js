const express = require('express')
const app = express()
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

//Get a society
app.get('/entreprise/:name?',  (req, res) => {

  let page = req.query.page? req.query.page : 1;

  console.log(req.params.name + " " + page)

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

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
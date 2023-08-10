const config = require('config');
const url = config.get('api.url');
const database = config.get('database');
const axios = require('axios').default;

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

knex.schema.hasTable('siege').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('siege', function(t) {
       t.increments('id').primary();
       t.text('adresse');
       t.integer('code_postal');
       t.integer('commune');
    });
  }
});

//Create tables if they don't exist
knex.schema.hasTable('entreprise').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('entreprise', function(t) {
      t.integer('siren').primary();
      t.string('nom_complet', 200);
      t.date('date_creation');
      t.integer('siegeId');
      t.foreign('siegeId').references('id').inTable('siege')
    });
  }
});

//Get society information
axios.get(url)
  .then(function (response) {
    // handle success

    response.data['results'].forEach(element => {
      knex('entreprise')
      .insert(
        [
          { 
            siren: element['siren'] , 
            nom_complet: element['nom_complet'], 
            date_creation: element['date_creation'] 
          }, 
        ]
      )
      .then();
    });
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

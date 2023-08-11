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

      knex('siege')
      .insert(
        [
          { 
            adresse: element['siege']['adresse'] , 
            code_postal: element['siege']['code_postal'], 
            commune: element['siege']['commune'] 
          }, 
        ]
      )
      .then();

      knex('entreprise')
      .insert(
        [
          { 
            siren: element['siren'] , 
            nom_complet: element['nom_complet'], 
            date_creation: element['date_creation'] 
          }, 
        ],
        ['id']
      )
      .then(function (id) {
        console.log(id);
      });
    });
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });


  // knex(
  //   // insert values clause
  //   knex.raw('?? (??, ??, ??)', ['posts_authors', 'author_id', 'post_id', 'sort_order'])
  // ).insert(
  //   // select where not exists clause
  //   knex.select(
  //     knex.raw('?, ?, ?', [author_id, post_id, sort_order])
  //   ).whereNotExists(
  //     knex('posts_authors').select('id').where({ author_id, post_id: id })
  //   )
  // )

  // insert into "posts_authors" ("author_id", "post_id", "sort_order") select '1', '123', 10 where not exists (select "id" from "posts_authors" where "author_id" = '1' and "post_id" = '123');
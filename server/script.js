const config = require('config');
const url = config.get('api.url');
const database = config.get('database');
const axios = require('axios').default;
const lodash = require('lodash');

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

//Get societies information and insert them into the database
axios.get(url)
  .then(function (response) {
    // handle success
    (async function(){
      await ManageDatabaseTables();

      //Remove societies and his headquarter who are not return by the api anymore
      let currentSocieties = await GetSocieties();

      for (let element of currentSocieties) {
        let res = lodash.findIndex(response.data['results'], function(x) { return x['siren'] == element['siren']; }); 
        
        if(res == -1){
          await knex('entreprise')
          .del()
          .where({
            siren:element['siren']
          });

          await knex('etablissement')
          .del()
          .where({
            entrepriseId:element['siren']
          });
        }
      }
      
      //Insert new societies/headquarter or update existing one if a conflict is detected
      for (let element of response.data['results']) {
        await knex('etablissement')
        .insert(
          [
            { 
              siret: element['siege']['siret'], 
              adresse: element['siege']['adresse'] , 
              latitude: element['siege']['latitude'] , 
              longitude: element['siege']['longitude'] , 
              code_postal: element['siege']['code_postal'], 
              commune: element['siege']['commune'],
              est_siege: element['siege']['est_siege'],
              entrepriseId: element['siren']
            }, 
          ]
        )
        .onConflict('siret')
        .merge(['adresse', 'code_postal', 'commune']);
  
        await knex('entreprise')
        .insert(
          [
            { 
              siren: element['siren'], 
              nom_complet: element['nom_complet'],
              nom_raison_sociale: element['nom_raison_sociale'],
              date_creation: element['date_creation'],
              siegeId: element['siege']['siret'],
            }, 
          ]
        )
        .onConflict('siren')
        .merge(['siren', 'nom_complet', 'nom_raison_sociale', 'date_creation']);
      }

    })()
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

//Return all societies from database
  async function GetSocieties(){
    return await knex.select('siren')
    .from('entreprise')
  }

//Create table if they don't exist
  async function ManageDatabaseTables(){
    //Create table etablissement if doesn't exist
    var etablissementExists = await knex.schema.hasTable('etablissement')
    if (!etablissementExists) {
      await knex.schema.createTable('etablissement', function(t) {
        t.bigint('siret').primary();
        t.text('adresse');
        t.text('latitude');
        t.text('longitude');
        t.integer('code_postal');
        t.integer('commune');
        t.boolean('est_siege');
        t.bigint('entrepriseId');
      });
    }

    //Create table entreprise if doesn't exist
    var entrepriseExists = await knex.schema.hasTable('entreprise')
    if (!entrepriseExists) {
      await knex.schema.createTable('entreprise', function(t) {
        t.bigint('siren').primary();
        t.string('nom_complet', 200);
        t.string('nom_raison_sociale', 200);
        t.date('date_creation');
        t.bigint('siegeId');
        t.foreign('siegeId').references('siret').inTable('etablissement')
      });
    }

    //Add foreign key constraint if etablissement table has just been created
    if (!etablissementExists) {
      await knex.schema.alterTable('etablissement', function(t) {
        t.foreign('entrepriseId').references('siren').inTable('entreprise')
      });
    }
  }
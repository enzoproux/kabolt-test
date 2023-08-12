require("../models/SuccessResponseModel");
require("../models/ErrorResponseModel");

const config = require('config');
const database = config.get('database');
const request = config.get('request');
const {SocietiesResponseModel, SocietyResponseModel} = require('../models/SocietyResponseModel.js');

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

module.exports = {

  async list(request, response) {

    try {
      let page = request.query.page? request.query.page : 1;
      let limit = request.query.limit? request.query.limit : request.limit;

      var model = knex.table('entreprise')
      var totalCount = await model.clone().count('* AS total');
      var data = await model.clone().offset((page - 1) * limit).limit(limit).select('siren', 'nom_complet', 'date_creation');
      
      successResponse(response, SocietiesResponseModel(data, totalCount));

    } catch (error) {
      console.error(error);
      errorResponseModel(response, "");
    }
  },

  async findByName(request, response) {    
      try {
        let page = request.query.page? request.query.page : 1;
        let limit = request.query.limit? request.query.limit : request.limit;

        var model = knex.table('entreprise')
        var totalCount = await model.clone().count('* AS total').whereILike('nom_complet', '%' + request.query.name + '%');
        var data = await model.clone().offset((page - 1) * limit).limit(limit).select('siren', 'nom_complet', 'date_creation').whereILike('nom_complet', '%' + request.query.name + '%');
  
        successResponse(response, SocietiesResponseModel(data, totalCount));
  
      } catch (error) {
        console.error(error);
        errorResponseModel(response, "");
      }
  },

  async findById(request, response) {
    try {
      let data = await knex('entreprise')
      .join('etablissement', 'entreprise.siegeId', 'etablissement.siret')
      .select('entreprise.siren', 'entreprise.nom_complet', 'entreprise.date_creation', 
      'etablissement.siret', 'etablissement.commune', 'etablissement.adresse', 'etablissement.code_postal')
      .where('etablissement.est_siege', true)
      .andWhere('entreprise.siren', request.params.id);

      successResponse(response, SocietyResponseModel(data));

    } catch (error) {
      console.error(error);
      errorResponseModel(response, "");
    }
  },
};
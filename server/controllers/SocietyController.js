const config = require('config');
const database = config.get('database');
const webapp = config.get('webapp');
const puppeteer = require('puppeteer');
const requestConfig = config.get('request');
const {SocietiesResponseModel, SocietyResponseModel} = require('../models/SocietyResponseModel.js');
const {ErrorResponseModel, SuccessResponseModel} = require('../models/ResultResponseModel.js');

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
      let limit = request.query.limit? request.query.limit : requestConfig.limit;

      var model = knex.table('entreprise')
      var totalCount = await model.clone().count('* AS total');
      var data = await model.clone().offset((page - 1) * limit).limit(limit).select('siren', 'nom_complet', 'nom_raison_sociale', 'date_creation');
      
      SuccessResponseModel(response, SocietiesResponseModel(data, totalCount));

    } catch (error) {
      console.error(error);
      ErrorResponseModel(response, "");
    }
  },

  async findByName(request, response) {    
      try {
        let page = request.query.page? request.query.page : 1;
        let limit = request.query.limit? request.query.limit : requestConfig.limit;

        var model = knex.table('entreprise')
        var totalCount = await model.clone().count('* AS total').whereILike('nom_complet', '%' + request.query.name + '%');
        var data = await model.clone().offset((page - 1) * limit).limit(limit).select('siren', 'nom_complet', 'nom_raison_sociale' ,'date_creation').whereILike('nom_complet', '%' + request.query.name + '%');
  
        SuccessResponseModel(response, SocietiesResponseModel(data, totalCount));
  
      } catch (error) {
        console.error(error);
        ErrorResponseModel(response, "");
      }
  },

  async findById(request, response) {
    try {
      let data = await knex('entreprise')
      .join('etablissement', 'entreprise.siegeId', 'etablissement.siret')
      .select('entreprise.siren', 'entreprise.nom_complet', 'entreprise.nom_raison_sociale' ,'entreprise.date_creation', 
      'etablissement.siret', 'etablissement.commune', 'etablissement.adresse', 'etablissement.latitude', 'etablissement.longitude', 'etablissement.code_postal')
      .where('etablissement.est_siege', true)
      .andWhere('entreprise.siren', request.params.id);

      SuccessResponseModel(response, SocietyResponseModel(data));

    } catch (error) {
      console.error(error);
      ErrorResponseModel(response, "");
    }
  },

  async getSocietyPagePdf(request, response) {
    try {
        // Create a browser instance
        const browser = await puppeteer.launch({headless: "new"});

        // Create a new page
        const page = await browser.newPage();

        // Website URL to export as pdf
        const website_url = `${webapp.url}/${webapp.societyPath}/${request.params.id}`

        // Open URL in current page
        // We wait until there are no more than 0 network connections for at least 500ms by using the value networkidle0
        await page.goto(website_url, { waitUntil: 'networkidle0' });

        //To reflect CSS used for screens instead of print
        await page.emulateMediaType('screen');

        // Downlaod the PDF
        const pdf = await page.pdf({
          path: `societyPagePdf/${request.params.id}.pdf`,
          printBackground: true,
          format: 'A4',
        });

        // Close the browser instance
        await browser.close();

        response.download(`societyPagePdf/${request.params.id}.pdf`);
        
    } catch (error) {
      console.error(error);
      ErrorResponseModel(response, "");
    }
  }
};
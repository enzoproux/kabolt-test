exports.SocietiesResponseModel = societiesResponseModel = (data, rowCount) => {
    let societies = [];

    data.forEach(element => {
        societies.push({
            siren: element.siren,
            name: element.nom_complet,
            socialName: element.nom_raison_sociale,
            creationDate: element.date_creation
        })
    });

    return {
        
        societies: societies,
        rowCount: rowCount[0].total
    }
}

exports.SocietyResponseModel = societyResponseModel = (data) => {
    return {
        society: {
            siren: data[0].siren,
            name: data[0].nom_complet,
            socialName: data[0].nom_raison_sociale,
            creationDate: data[0].date_creation,
            headquarter: {
                siret: data[0].siret,
                address: data[0].adresse,
                postalCode: data[0].code_postal,
                town: data[0].commune,
            }
        }
    }
}

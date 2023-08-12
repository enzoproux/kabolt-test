exports.SocietiesResponseModel = societiesResponseModel = (data, rowCount) => {
    let society = [];

    data.forEach(element => {
        society.push({
            siren: element.siren,
            name: element.nom_complet,
            creationDate: element.date_creation
        })
    });

    return {
        
        society: society,
        rowCount: rowCount[0].total
    }
}

exports.SocietyResponseModel = societyResponseModel = (data) => {
    return {
        society: {
            siren: data[0].siren,
            name: data[0].nom_complet,
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

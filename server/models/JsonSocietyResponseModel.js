var JsonSocietyResponseModel = function() {
    this.fields = {
        siren: null,
        nom_complet: null,
        date_creation: null,
        society_count: null
    };
};

module.exports = function(newFields) {
    var instance = new Cat();
    instance.fill(newFields);
    return instance;
};
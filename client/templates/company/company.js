Template.companyHeader.helpers({
	"getCompanySize": function () {
		var companySizeObj = Lists.companySizes.get(this.size);
		if (companySizeObj) {
			return companySizeObj.name;
		}
		return "Taille non renseignée";
	},
	"getCompanyField": function () {
		if (this.field) {
			return this.field;
		}
		return "Secteur non renseigné";
	},
	"getCompanyLocation": function () {
		if (this.location) {
			return this.location;
		}
		return "Ville non renseignée";
	},

	"getCompanyPopularity": function () {
		return "Popularité non disponible";
	},
	"getCompanyType": function () {
		var companyType = Lists.companyTypes.get(this.type);
		if (companyType) {
			return companyType.name;
		}
		return "Type d'entreprise non renseigné";
	},

	"getCompanyKeyFigures": function () {
		return "Aucune donnée";
	},
});
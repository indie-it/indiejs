Template.companyHeader.helpers({
	"getCompanySize": function () {
		var companySizeObj = Lists.companySizes.get(this.company.size);
		if (companySizeObj) {
			return companySizeObj.name;
		}
		return "Taille non renseignée";
	},
	"getCompanyField": function () {
		if (this.company.field) {
			return this.company.field;
		}
		return "Secteur non renseigné";
	},
	"getCompanyLocation": function () {
		if (this.company.location) {
			return this.company.location;
		}
		return "Ville non renseignée";
	},

	"getCompanyPopularity": function () {
		return "Popularité non disponible";
	},
	"getCompanyType": function () {
		var companyType = Lists.companyTypes.get(this.company.type);
		if (companyType) {
			return companyType.name;
		}
		return "Type d'entreprise non renseigné";
	},

	"getCompanyKeyFigures": function () {
		return "Aucune donnée";
	},
});

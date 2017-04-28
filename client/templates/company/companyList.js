Template.companyList.helpers({
	"hasCompanies": function () {
		if (!this.companies) { return false; }
		return this.companies.count() > 0;
	},
});
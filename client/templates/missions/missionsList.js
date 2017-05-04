
Template.missionsList.helpers({
	"hasMissions": function () {
		if (!this.missions) {
			return false;
		}
		return this.missions.count() > 0;
	},

	"getCategories": function () {
		if (!this.categories) {
			return "";
		}
		return this.categories.join(", ");
	},
});

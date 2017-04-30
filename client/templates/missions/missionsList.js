
Template.missionsList.helpers({
	"hasMissions": function () {
		if (!this.missions) {
			return false;
		}
		return this.missions.count() > 0;
	},
});

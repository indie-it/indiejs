Template.home.helpers({
	"hasActions": function () {
		if (!this.actions) {
			return false;
		}
		return this.actions.count() > 0;
	},
});
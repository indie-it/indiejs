import {
	Meteor
} from 'meteor/meteor';

Template.mission.helpers({
	getMissionStart: function() {
		console.log("getMissionStart");
		if (!!this.mission.isEarliestStart) {
			return "au plus tôt";
		}
		return Utils.formatDate(this.mission.start);
	},
	interested: function() {
		console.log("interested");

	},
	notinterested: function() {
		console.log("notinterested");

	},
	create: function() {
		console.log("create");
	},
	rendered: function() {
		console.log("rendered");
	},
	destroyed: function() {
		console.log("destroyed");
	},
});

Template.mission.events({
	"click #interested": function(event, template) {
		console.log("interested");
		console.log(this.mission._id);

		// Meteor.subscribe("mission.interested", this.mission._id);

		Meteor.call("mission.interested", this.mission._id, function(error, result) {
			if (error) {
				console.log("error", error);
			}
			if (result) {
				console.log(result);
				sAlert.success("Avis pris en compte.");
			}
		});

	},
	"click #notinterested": function(event, template) {
		console.log("notinterested");

		Meteor.call("mission.notinterested", this.mission._id, function(error, result) {
			if (error) {
				console.log("error", error);
			}
			if (result) {
				console.log(result);
				sAlert.success("Avis pris en compte.");
			}
		});
	},
});

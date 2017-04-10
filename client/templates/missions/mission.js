import { Meteor } from 'meteor/meteor';

Template.mission.helpers({
	"getMissionStart": function () {
		console.log("getMissionStart");
		if (!!this.mission.isEarliestStart) {
			return "au plus tôt";
		}
		return Utils.formatDate(this.mission.start);
	},
	"getMissionDuration": function () {
		return !this.mission.duration ? "" : moment.duration( this.mission.duration, 'days').humanize();
	},
	"userHasAnswered": function () {

		var answered = false;

		if (this.mission.interestedUserIds && _.indexOf(this.mission.interestedUserIds, Meteor.userId()) != -1) {
			answered = true;
		}

		if (this.mission.notinterestedUserIds && _.indexOf(this.mission.notinterestedUserIds, Meteor.userId()) != -1) {
			answered = true;
		}

		return answered;
	},
	"getAnswerText": function () {
		var answerText = "";
		if (this.mission.interestedUserIds && _.indexOf(this.mission.interestedUserIds, Meteor.userId()) != -1) {
			answerText = "Vous êtes intéressé(e) par cette mission.";
		}

		if (this.mission.notinterestedUserIds && _.indexOf(this.mission.notinterestedUserIds, Meteor.userId()) != -1) {
			answerText = "Vous n'êtes pas intéressé(e) par cette mission.";
		}

		return answerText;
	},
	"getAnswerClass": function () {
		var aclass = "";
		if (this.mission.interestedUserIds && _.indexOf(this.mission.interestedUserIds, Meteor.userId()) != -1) {
			aclass = "up";
		}
		if (this.mission.notinterestedUserIds && _.indexOf(this.mission.notinterestedUserIds, Meteor.userId()) != -1) {
			aclass = "down";
		}
		return aclass;
	},
});

Template.mission.events({
	"click #interested": function (event, template) {
		console.log("interested");
		console.log(this.mission._id);

		Meteor.call("mission.interested", this.mission._id, function (error, result) {
			if (error) {
				console.log("error", error);
			}
			if (result) {
				console.log(result);
				sAlert.success("Avis pris en compte.", { onRouteClose: false });
				Router.go(Utils.pathFor('missionsList'));
			}
		});

	},
	"click #notinterested": function (event, template) {
		console.log("notinterested");

		Meteor.call("mission.notinterested", this.mission._id, function (error, result) {
			if (error) {
				console.log("error", error);
			}
			if (result) {
				console.log(result);
				sAlert.success("Avis pris en compte.", { onRouteClose: false });
				Router.go(Utils.pathFor('missionsList'));
			}
		});
	},
});

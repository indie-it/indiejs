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
		return !this.mission.duration ? "" : moment.duration(this.mission.duration, 'days').humanize();
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
	"getInterestedUsersText": function () {
		console.log("this.mission.interestedUserIds.length: " + this.mission.interestedUserIds.length);

		var isUserInterested = _.indexOf(this.mission.interestedUserIds, Meteor.userId()) != -1;
		var isUserNotInterested = _.indexOf(this.mission.notinterestedUserIds, Meteor.userId()) != -1;

		if (!this.mission.interestedUserIds || this.mission.interestedUserIds.length === 0) {
			return "Cette mission n'intéresse encore personne."
		}

		if (isUserInterested) {
			if (this.mission.interestedUserIds.length > 1) {
				return `Cette mission intéresse aussi ${(this.mission.interestedUserIds.length - 1)} autre(s) personne(s).`;
			}
			if (this.mission.interestedUserIds.length === 1) {
				return "Vous êtes la seule personne intéressée par cette mission pour l'instant.";
			}

		}
		return `Cette mission intéresse ${this.mission.interestedUserIds.length} personne(s).`;
	},
	"canAccept": function () {
		var tpl = Template.instance();
		var obj = tpl.actions.get();
		if (!obj) {
			return false;
		}
		return obj.canAccept;
	},
	"canArchive": function () {
		var tpl = Template.instance();
		var obj = tpl.actions.get();
		if (!obj) {
			return false;
		}
		return obj.canArchive;
	},
	"canValidate": function () {
		var tpl = Template.instance();
		var obj = tpl.actions.get();
		if (!obj) {
			return false;
		}
		return obj.canValidate;
	},
	"canVote": function () {
		return this.mission.currentState === 'validated';
	},
});

Template.mission.created = function () {
	console.log("Template.mission.created");
	this.actions = new ReactiveVar();
};
Template.mission.rendered = function () {
	console.log("Template.mission.rendered");
	var self = this;
	Meteor.apply('mission.getActions', [this.data.id], { wait: true }, function (err, result) {
		if (err) {
			sAlert.error(500, err.message);
			return;
		}
		self.actions.set(result);
	});
};

Template.mission.events({
	"click #interested": function (event, template) {
		console.log("interested");
		console.log(this.mission._id);

		Meteor.call("mission.interested", this.mission._id, function (error, result) {
			if (error) {
				sAlert.error("error", error.message);
				return;
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
				sAlert.error("error", error.message);
				return;
			}
			if (result) {
				console.log(result);
				sAlert.success("Avis pris en compte.", { onRouteClose: false });
				Router.go(Utils.pathFor('missionsList'));
			}
		});
	},
	"click #action-archive": function (event, template) {
		console.log("click #action-archive");
		Meteor.call("mission.archive", this.mission._id, function (error, result) {
			if (error) {
				sAlert.error("error", error.message);
				return;
			}
			sAlert.success("Mission archivée", { onRouteClose: false });
			Router.go(Utils.pathFor('missionsList'));
		});
	},
	"click #action-validate": function (event, template) {
		console.log("click #action-validate");
		Meteor.call("mission.validate", this.mission._id, function (error, result) {
			if (error) {
				sAlert.error("error", error.message);
				return;
			}
			sAlert.success("Mission validée", { onRouteClose: false });
			Router.go(Utils.pathFor('missionsList'));
		});
	},
	"click #action-accept": function (event, template) {
		console.log("click #action-accept");
		Meteor.call("mission.accept", this.mission._id, function (error, result) {
			if (error) {
				sAlert.error("error", error.message);
				return;
			}
			sAlert.success("Mission acceptée", { onRouteClose: false });
			Router.go(Utils.pathFor('missionsList'));
		});
	},
});

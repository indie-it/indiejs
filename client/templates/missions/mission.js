import { Meteor } from 'meteor/meteor';

Template.mission.helpers({
	"getCurrentState": function () {

		if (!this.mission) {
			return "Etape introuvable";
		}

		var step = Lists.missionWorkflow.get(this.mission.currentState.step);
		if (!step) {
			return "Etape introuvable";
		}

		return step.text;
	},
	"getCurrentStateIcon": function() {
		if (!this.mission) {
			return "fa-cogs";
		}

		var step = Lists.missionWorkflow.get(this.mission.currentState.step);
		if (!step) {
			return "fa-cogs";
		}

		return step.icon;
	},
	"getCurrentStateClass": function() {
		var classname = "label-primary";
		if (!this.mission) {
			return classname;
		}

		var step = Lists.missionWorkflow.get(this.mission.currentState.step);
		if (!step) {
			return classname;
		}

		return step.classname;

	},
	"getMissionStart": function () {
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
		if (this.mission.interestedUserIds && _.indexOf(this.mission.interestedUserIds, Meteor.userId()) !== -1) {
			answered = true;
		}
		if (this.mission.notinterestedUserIds && _.indexOf(this.mission.notinterestedUserIds, Meteor.userId()) !== -1) {
			answered = true;
		}
		return answered;
	},
	"getAnswerText": function () {
		var answerText = "";
		if (this.mission.interestedUserIds && _.indexOf(this.mission.interestedUserIds, Meteor.userId()) !== -1) {
			answerText = "Vous êtes intéressé(e) par cette mission.";
		}

		if (this.mission.notinterestedUserIds && _.indexOf(this.mission.notinterestedUserIds, Meteor.userId()) !== -1) {
			answerText = "Vous n'êtes pas intéressé(e) par cette mission.";
		}

		return answerText;
	},
	"getAnswerClass": function () {
		var aclass = "";
		if (this.mission.interestedUserIds && _.indexOf(this.mission.interestedUserIds, Meteor.userId()) !== -1) {
			aclass = "up";
		}
		if (this.mission.notinterestedUserIds && _.indexOf(this.mission.notinterestedUserIds, Meteor.userId()) !== -1) {
			aclass = "down";
		}
		return aclass;
	},
	"getInterestedUsersText": function () {
		var isUserInterested = _.indexOf(this.mission.interestedUserIds, Meteor.userId()) !== -1;
		var isUserNotInterested = _.indexOf(this.mission.notinterestedUserIds, Meteor.userId()) !== -1;
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
		var obj = Session.get("actions");
		if (!obj) {
			return false;
		}
		return obj.canAccept;
	},
	"canArchive": function () {
		var obj = Session.get("actions");
		if (!obj) {
			return false;
		}
		return obj.canArchive;
	},
	"canValidate": function () {
		var obj = Session.get("actions");
		if (!obj) {
			return false;
		}
		return obj.canValidate;
	},
	"canVote": function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return false;
		}
		return this.mission.currentState.step === Lists.missionWorkflow.map.STEP_VALIDATED;
	},
	"canModify": function () {
		return Roles.userIsInRole(Meteor.userId(), 'admin');
	},
});

Template.mission.created = function () {
	$('#select-freelancer').hide();
};
Template.mission.rendered = function () {

	$('#select-freelancer').hide();

	var self = this;
	Meteor.apply('mission.getActions', [this.data.id], { wait: true }, function (err, result) {
		if (err) {
			sAlert.error(500, err.message);
			return;
		}
		Session.set("actions", result);
	});
};

Template.mission.events({
	"click #interested": function (event, template) {
		Meteor.call("mission.interested", this.mission._id, function (error, result) {
			if (error) {
				sAlert.error("error", error.message);
				return;
			}
			if (result) {
				sAlert.success("Avis pris en compte.", { onRouteClose: false });
				Router.go(Utils.pathFor('missionsList'));
			}
		});
	},
	"click #notinterested": function (event, template) {
		Meteor.call("mission.notinterested", this.mission._id, function (error, result) {
			if (error) {
				sAlert.error("error", error.message);
				return;
			}
			if (result) {
				sAlert.success("Avis pris en compte.", { onRouteClose: false });
				Router.go(Utils.pathFor('missionsList'));
			}
		});
	},
	"click #action-archive": function (event, template) {
		var self = this;
		Meteor.call("mission.archive", this.mission._id, function (error, result) {
			if (error) {
				sAlert.error("error", error.message);
				return;
			}
			sAlert.success("Mission archivée", { onRouteClose: false });
			Meteor.apply('mission.getActions', [self.mission._id], { wait: true }, function (err, result) {
				if (err) {
					sAlert.error(500, err.message);
					return;
				}
				Session.set("actions", result);
			});
		});
	},
	"click #action-validate": function (event, template) {
		var self = this;
		Meteor.call("mission.validate", this.mission._id, function (error, result) {
			if (error) {
				sAlert.error("error", error.message);
				return;
			}
			sAlert.success("Mission validée", { onRouteClose: false });
			Meteor.apply('mission.getActions', [self.mission._id], { wait: true }, function (err, result) {
				if (err) {
					sAlert.error(500, err.message);
					return;
				}
				Session.set("actions", result);
			});
		});
	},
	"click #action-accept": function (event, template) {
		event.preventDefault();

		var self = this;

		$('#select-freelancer').toggle();
	},
});


Template.assignUser.events({

	"click a": function (event, template) {

		// récupération de l'id d'utilisateur.
		var userid = this.userid;
		console.log(`userid: ${userid}`);

		// récupération de l'id de mission (param d'url')...
		var missionid = Router.current().params._id;
		console.log(`missionid: ${missionid}`);

		// appel meteor serveur
		Meteor.call("mission.accept", missionid, userid, function (err, res) {
			if (err) {
				console.error(err);
				sAlert.error("error", err.message);
				return;
			}
			sAlert.success("Mission acceptée", { onRouteClose: false });

			Meteor.apply('mission.getActions', [missionid], { wait: true }, function (err, result) {
				if (err) {
					sAlert.error(500, err.message);
					return;
				}
				Session.set("actions", result);
			});
		});

	},

});

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import changeCase from 'change-case';


// mission
Template.mission.helpers({

	"getCurrentState": () => {
		console.log("getCurrentState");
		var mission = Template.instance().data.mission;

		if (!mission) {
			return "Etape introuvable";
		}

		var step = Lists.missionWorkflow.get(mission.currentState.step);
		if (!step) {
			return "Etape introuvable";
		}

		return step.text;
	},
	"getCurrentStateTooltip": () => {
		console.log("getCurrentStateTooltip");

		var mission = Template.instance().data.mission;
		if (!mission) {
			return "";
		}

		var step = Lists.missionWorkflow.get(mission.currentState.step);
		if (!step) {
			return "";
		}

		return step.tooltip;
	},
	"getCurrentStateIcon": () => {
		console.log("getCurrentStateIcon");
		var mission = Template.instance().data.mission;
		if (!mission) {
			return "fa-cogs";
		}

		var step = Lists.missionWorkflow.get(mission.currentState.step);
		if (!step) {
			return "fa-cogs";
		}

		return step.icon;
	},
	"getCurrentStateClass": () => {
		var classname = "label-primary";
		var mission = Template.instance().data.mission;
		if (!mission) {
			return classname;
		}

		var step = Lists.missionWorkflow.get(mission.currentState.step);
		if (!step) {
			return classname;
		}

		return step.classname;

	},
	"userHasAnswered": () => {
		var answered = false;
		var mission = Template.instance().data.mission;
		if (mission.interestedUserIds && _.indexOf(mission.interestedUserIds, Meteor.userId()) !== -1) {
			answered = true;
		}
		if (mission.notinterestedUserIds && _.indexOf(mission.notinterestedUserIds, Meteor.userId()) !== -1) {
			answered = true;
		}
		return answered;
	},
	"getAnswerText": () => {
		var answerText = "";
		var mission = Template.instance().data.mission;
		if (mission.interestedUserIds && _.indexOf(mission.interestedUserIds, Meteor.userId()) !== -1) {
			answerText = "Vous avez postulé pour cette mission.";
		}

		if (mission.notinterestedUserIds && _.indexOf(mission.notinterestedUserIds, Meteor.userId()) !== -1) {
			answerText = "Vous n'êtes pas intéressé(e) par cette mission.";
		}

		return answerText;
	},
	"getAnswerClass": () => {
		var aclass = "";
		var mission = Template.instance().data.mission;
		if (mission.interestedUserIds && _.indexOf(mission.interestedUserIds, Meteor.userId()) !== -1) {
			aclass = "up";
		}
		if (mission.notinterestedUserIds && _.indexOf(mission.notinterestedUserIds, Meteor.userId()) !== -1) {
			aclass = "down";
		}
		return aclass;
	},
	"getInterestedUsersText": () => {
		var mission = Template.instance().data.mission;
		var isUserInterested = _.indexOf(mission.interestedUserIds, Meteor.userId()) !== -1;
		var isUserNotInterested = _.indexOf(mission.notinterestedUserIds, Meteor.userId()) !== -1;
		if (!mission.interestedUserIds || mission.interestedUserIds.length === 0) {
			return "Personne n'a encore postulé à cette mission."
		}
		if (isUserInterested) {
			if (mission.interestedUserIds.length > 1) {
				return `Cette mission intéresse aussi ${(mission.interestedUserIds.length - 1)} autre(s) personne(s).`;
			}
			if (mission.interestedUserIds.length === 1) {
				return "Vous êtes la seule personne ayant postulé pour l'instant.";
			}

		}
		return `Cette mission intéresse ${mission.interestedUserIds.length} personne(s).`;
	},

	"canVote": () => {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return false;
		}
		var mission = Template.instance().data.mission;
		return mission.currentState.step === Lists.missionWorkflow.map.STEP_VALIDATED;
	},
});
Template.mission.events({

	"click #interested": (event, template) => {
		var mission = Template.instance().data.mission;
		Meteor.call("mission.apply", mission._id, function (error, result) {
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
	"click #notinterested": (event, template) => {
		var mission = Template.instance().data.mission;
		Meteor.call("mission.notinterested", mission._id, function (error, result) {
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

});

// missionAdminPanel
Template.missionAdminPanel.rendered = () => {
	console.log("Template.missionAdminPanel.rendered");

	$('#select-freelancer').hide();

	var mission = Template.instance().data.mission;
	Meteor.apply('mission.getActions', [mission._id], { wait: true }, function (err, result) {
		if (err) {
			console.error(err);
			sAlert.error("Erreur", err.message);
			return;
		}
		Session.set("actions", result);
	});
};
Template.missionAdminPanel.helpers({
	"getWorkflowActions": () => {
		console.log("getWorkflowActions");
		return Session.get("actions");
	},
	"actionAccept": () => {
		console.log("actionAccept");
		var obj = Session.get("actions");
		if (!obj) {
			return false;
		}
		return _.findWhere(obj, { 'id': 'mission-accept' });
	},
	"canModify": () => {
		return Roles.userIsInRole(Meteor.userId(), 'admin');
	},
});
Template.missionAdminPanel.events({

	"click #action-mission-accept": (event, template) => {
		event.preventDefault();
		console.log("click #action-mission-accept");
		$('#select-freelancer').toggle();
	},
	"click .workflow": (event, template) => {
		console.log("click .workflow");
		console.log(template);

		var actionid = event.currentTarget.id;
		var missionid = template.data.mission._id;

		Meteor.call("mission.transition", missionid, actionid, function (error, result) {
			if (error) {
				sAlert.error("Erreur", error.message);
				return;
			}

			sAlert.success("Action réalisée", { onRouteClose: false });

			Meteor.apply('mission.getActions', [missionid], { wait: true }, function (err, res) {
				if (err) {
					sAlert.error("Erreur", err.message);
					return;
				}
				Session.set("actions", res);
			});
		});
	},

});


// assignUser
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


// missionLabels
Template.missionLabels.helpers({
	"getTJM": () => {
		console.log("Template.missionLabels.getTJM");

		var mission = Template.instance().data.mission;
		if (!mission.averageDailyRate || (!mission.averageDailyRate.min && !mission.averageDailyRate.max)) {
			return "Non renseigné";
		}
		if (mission.averageDailyRate.min && !mission.averageDailyRate.max) {
			return `A partir de ${mission.averageDailyRate.min} €/j`;
		}
		if (!mission.averageDailyRate.min && mission.averageDailyRate.max) {
			return `${mission.averageDailyRate.max} €/j maximum`;
		}
		return `Entre ${mission.averageDailyRate.min} et ${mission.averageDailyRate.max} €/j`;
	},
	"getMissionDuration": () => {
		console.log("Template.missionLabels.getMissionDuration");

		var mission = Template.instance().data.mission;

		if (!mission.duration) {
			return "";
		}
		var days = mission.duration;
		if (days >= 20) {
			var months = days / 20;
			return `${moment.duration(months, 'months').humanize()} (${days}j)`;
		}
		return moment.duration(mission.duration, 'days').humanize();
	},
	"getMissionStart": () => {
		console.log("Template.missionLabels.getMissionStart");

		var mission = Template.instance().data.mission;
		if (!!mission.isEarliestStart) {
			return "Début au plus tôt";
		}
		return "Début " + Utils.formatDate(mission.start);
	},
});

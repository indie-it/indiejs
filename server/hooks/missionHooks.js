import missionNotifier from '../../imports/modules/server/mission-notifier.js';
import { transitions } from '../../imports/modules/server/mission-workflow.js';
import utils from '../../imports/modules/server/utils.js';

// Missions est défini dans lib/01.collections/MissionCollection.js

Missions.after.insert(function (userId, doc) {

	console.log("[missionHook] Missions.after.insert");

	var action = {
		actionType: Lists.actions.map.missionCreate,
		userid: userId,
		options: {
			'mission': doc.name,
			'missionid': doc._id,
			'username': Meteor.user().username
		}
	};


	Actions.insert(action, function (err, objId) {
		if (err) {
			console.error(err);
			return;
		}
		console.log("Action enregistrée");
	});

	// notification des admins
	missionNotifier.notifyAdmins(doc, action.actionType);

});
Missions.after.update(function (userId, doc, fieldNames, modifier, options) {

	console.log("[missionHook] Missions.after.update occured!");

	// identifier l'action réalisée...
	var actionType = Lists.actions.map.missionUpdate;

	// si les étapes ont changé, on va inscrire un action validé/archivé/accepté et non une mise à jour...
	if (this.previous.currentState.step !== doc.currentState.step) {
		console.log("[missionHook] this.previous.currentState.step !== doc.currentState.step");
		var transition = transitions.get(this.previous.currentState.step, doc.currentState.step);
		if (transition) {
			console.log(transition);
			actionType = transition.id;
		}
	}

	var diff = [];
	var userid = null;

	// ...sinon, on vérifie si c'est une candidature (interested/not interested)
	if (doc.interestedUserIds && (!this.previous.interestedUserIds || doc.interestedUserIds.length > this.previous.interestedUserIds.length)) {
		diff = utils.getArrayDifferences(this.previous.interestedUserIds, doc.interestedUserIds);
		console.log(diff);

		// on sauvegarde l'id de l'utilisateur
		if (diff.added && diff.added.length == 1) {
			userid = diff.added[0];
			console.log("userid: ", userid);
		}

		console.log("[missionHook] interestedUserIds changed");
		actionType = Lists.actions.map.userInterested;
	}
	else if (doc.notinterestedUserIds && (!this.previous.notinterestedUserIds || doc.notinterestedUserIds.length > this.previous.notinterestedUserIds.length)) {
		diff = utils.getArrayDifferences(this.previous.interestedUserIds, doc.interestedUserIds);
		console.log(diff);

		console.log("[missionHook] notinterestedUserIds changed");
		actionType = Lists.actions.map.userNotInterested;
	}

	// création de l'action
	var action = {
		actionType: actionType,
		userid: userId,
		options: {
			'mission': doc.name,
			'missionid': doc._id,
			'username': Meteor.user().username,
		},
	};

	console.log(action);

	Actions.insert(action, function (err, objId) {
		if (err) {
			console.error(err);
			return;
		}
		console.log("Action enregistrée");
	});

	// notification des personnes concernées
	var obj = {
		'missionid': doc._id,
		'mission': doc.name,
		'username': Meteor.user().username,

	};
	if (doc.companyId) {
		obj.companyid = doc.companyId;
	}
	if (user != null) {
		//'profileid'
		var profile = FreelanceProfile.findOne({ _id: userid });
		if (profile) {
			obj.profileid = profile._id;

			if (profile.contact.firstName) { obj.profileFirstName = profile.contact.firstName; }
			if (profile.contact.firstName) { obj.profileLastName = profile.contact.lastName; }
		}
	}

	missionNotifier.notify(doc, action.actionType, obj);
});

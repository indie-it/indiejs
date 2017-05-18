import missionNotifier from '../../imports/modules/server/mission-notifier.js';

// Missions est défini dans lib/01.collections/MissionCollection.js

Missions.after.insert(function (userId, doc) {

	console.log("[collection-hook] Missions.after.insert");

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

	console.log("[collection-hook] Missions.after.update occured!");

	// identifier l'action réalisée...
	var actionType = Lists.actions.map.missionUpdate;

	// si les étapes ont changé, on va inscrire un action validé/archivé/accepté et non une mise à jour...
	if (this.previous.currentState.step !== doc.currentState.step) {
		console.log("[collection-hook] this.previous.currentState.step !== doc.currentState.step");
		var transition = MissionWorkflow.transitions.get(this.previous.currentState.step, doc.currentState.step);
		if (transition) {
			console.log(transition);
			actionType = transition.name;
		}
	}

	// ...sinon, on vérifie si c'est une candidature (interested/not interested)
	if (doc.interestedUserIds && (!this.previous.interestedUserIds || doc.interestedUserIds.length > this.previous.interestedUserIds.length)) {
		console.log("[collection-hook] interestedUserIds changed");
		actionType = Lists.actions.map.userInterested;
	}
	else if (doc.notinterestedUserIds && (!this.previous.notinterestedUserIds || doc.notinterestedUserIds.length > this.previous.notinterestedUserIds.length)) {
		console.log("[collection-hook] notinterestedUserIds changed");
		actionType = Lists.actions.map.userNotInterested;
	}

	// création de l'action
	var action = {
		actionType: actionType,
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

	// notification des utilisateurs
	//missionNotifier.notifyMatchingProfiles(doc, action);

});


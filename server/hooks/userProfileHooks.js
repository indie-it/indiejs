import profileNotifier from '../../imports/modules/server/user-profile-notifier.js';

UserProfiles.after.insert((userId, doc) => {
	console.log("UserProfiles.after.insert");

	var profileNameAndTitle = doc.firstName + " " + doc.lastName;
	if (doc.title) {
		profileNameAndTitle += " (" + doc.title + ")";
	}
	var action = {
		'actionType': Lists.actions.map.profileFreelancerCreate,
		'userid': userId,
		'options': {
			'profile': profileNameAndTitle,
			'profileid': doc._id,
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

	// notification des administrateurs
	profileNotifier.notifyAdmins(doc, action.actionType);
});
UserProfiles.after.update((userId, doc, fieldNames, modifier, options) => {
	console.log("UserProfiles.after.update");

	var profileNameAndTitle = doc.firstName + " " + doc.lastName;
	if (doc.title) {
		profileNameAndTitle += " (" + doc.title + ")";
	}
	var action = {
		'actionType': Lists.actions.map.profileFreelancerUpdate,
		'userid': userId,
		'options': {
			'profile': profileNameAndTitle,
			'profileid': doc._id,
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

	// notification des administrateurs
	profileNotifier.notifyAdmins(doc, action.actionType);

});
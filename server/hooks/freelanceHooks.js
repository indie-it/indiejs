import profileNotifier from '../../imports/modules/server/user-profile-notifier.js';

var getNameAndTitle = (doc) => {
    var firstName = doc.contact && doc.contact.firstName ? doc.contact.firstName : "";
    var lastName = doc.contact && doc.contact.lastName ? doc.contact.lastName : "";

	var profileNameAndTitle = `${firstName} ${lastName}`;
	if (doc.profile && doc.profile.title) {
		profileNameAndTitle += ` (${doc.profile.title})`;
	}
    return profileNameAndTitle;
};
var createActionForHook = (actionType, doc, userId) => {
    return {
		'actionType': actionType,
		'userid': userId,
		'options': {
			'profile': getNameAndTitle(doc),
			'profileid': doc._id,
			'username': Meteor.user().username
		}
	};
}

FreelanceProfile.after.insert((userId, doc) => {
	console.log("UserProfiles.after.insert");

	var action = createActionForHook(Lists.actions.map.profileFreelancerCreate, doc, userId);

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
FreelanceProfile.after.update((userId, doc, fieldNames, modifier, options) => {
	console.log("UserProfiles.after.update");

    var action = createActionForHook(Lists.actions.map.profileFreelancerUpdate, doc, userId);

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

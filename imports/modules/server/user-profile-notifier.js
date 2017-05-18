import { check } from 'meteor/check';
import emailNotification from './email-notification.js';

const getAdmins = () => {
	return Roles.getUsersInRole(Globals.roles.admin).fetch();
};
const getProfileUri = (profileId) => {
	return `https://www.indieit.fr${Utils.pathFor('profile', { '_id': profileId })}`;
}

/**
 * Notifie les administrateurs
 * @param {any} profileDoc
 * @param {any} actionType
 */
function notifyAdmins(profileDoc, actionType) {
	check(actionType, String);
	console.log(`profileNotifier.notifyAdmins - action.actionType: ${actionType}`);

	var admins = getAdmins();
	if (!admins || admins.length == 0) {
		console.log("\tAucun administrateur trouvé");
		return;
	}

	// on parcourt le tableau des admins
	_.each(admins, (obj) => {
		var email = obj.emails[0].address;
		var tpldata = {
			'firstName': obj.username,
			'user': {
				'firstName': profileDoc.firstName,
				'lastName': profileDoc.lastName,
				'title': profileDoc.title,
			}
		};
		console.log(tpldata);
		emailNotification.sendEmailForAction(email, actionType, getProfileUri(profileDoc._id), tpldata);
	});
}

export default {
	notifyAdmins,
};


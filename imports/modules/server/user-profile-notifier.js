import { check } from 'meteor/check';
import emailNotification from './email-notification.js';
import utils from './utils.js';
import notificationManager from './notification-manager.js';

/**
 * Notifie les administrateurs
 * @param {any} profileDoc
 * @param {any} actionType
 */
function notifyAdmins(profileDoc, actionType) {
	check(actionType, String);
	console.log(`profileNotifier.notifyAdmins - action.actionType: ${actionType}`);

	var admins = utils.getAdmins();
	if (!admins || admins.length == 0) {
		console.log("\tAucun administrateur trouvé");
		return;
	}

	// on récupère l'action à partir de l'id
	const action = Lists.actions.get(actionType);
	if (!action) {
		console.error(new Meteor.Error(500, `[mission-notifier.notifyAdmins] - Action non trouvée. [Id de l'action: ${actionType}]`));
		return;
	}

	var profileUri = utils.getAbsoluteProfileUri(profileDoc._id);

	// on parcourt le tableau des admins
	_.each(admins, (obj) => {

		// ajout de la notif
		notificationManager.create(actionType, obj._id, profileDoc._id);

		// notif par e-mail
		var email = obj.emails[0].address;
		var tpldata = {
			'firstName': obj.username,
			'user': {
				'firstName': profileDoc.contact.firstName,
				'lastName': profileDoc.contact.lastName,
				'title': profileDoc.profile.title,
			}
		};
		emailNotification.sendEmailForAction(email, actionType, profileUri, tpldata);
	});
}

export default {
	notifyAdmins,
};

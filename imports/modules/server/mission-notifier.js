import { check } from 'meteor/check';
import emailNotification from './email-notification.js';
import notificationManager from './notification-manager.js';
import utils from './utils.js';
import escapeStringRegexp from 'escape-string-regexp';

const getUserProfiles = (skills) => {

	check(skills, Array);

	for (var i = 0; i < skills.length; i++) {
		skills[i] = escapeStringRegexp(skills[i]);
	}

	const regexStr = skills.join("|");
	console.log(regexStr);
	var regexObj = { $regex: regexStr, $options: "i"};

	// définition du sélecteur
	const selector = {
		"search.isEnRecherche": true,
		"skills": { $elemMatch: { "name": regexObj } },
		// "notifications.newMissions": true,
	};

	// définition des options
	const options = {
		'fields': { userid: 1, contact: 1, search: 1, notifications: 1, },
		'transform': (doc) => {
			// on rajoute une propriété au document retourné
			doc.userObj = Meteor.users.findOne(doc.userid, { fields: { emails: 1 } });
			return doc;
		}
	};
	return FreelanceProfile
		.find(selector, options)
		.fetch();
};


/**
 * Notifie les utilisateurs potentiellement intéressés par la mission en cours
 * @param {any} missionDoc
 * @param {any} action
 */
function notifyMatchingProfiles(missionDoc, actionType) {

	check(actionType, String);

	console.log(`[mission-notifier.notifyMatchingProfiles] - action.actionType: ${actionType}`);

	// on récupère l'action à partir de l'id
	const action = Lists.actions.get(actionType);
	if (!action) {
		console.error(new Meteor.Error(500, `[mission-notifier.notifyMatchingProfiles] - Action non trouvée. [Id de l'action: ${actionType}]`));
		return;
	}

	// on teste cette action : existe-t-il une propriété notifyUsers ?
	if (!action.notifyUsers || action.notifyUsers === false) {
		console.log("[mission-notifier.notifyMatchingProfiles] - Pas de notification pour cette action.");
		return;
	}

	// y a-t-il des profils correspondants aux technos de cette mission ?
	var profiles = getUserProfiles(missionDoc.technos);
	if (!profiles || profiles.length == 0) {
		console.log("[mission-notifier.notifyMatchingProfiles] - Aucun profil ne correspond...");
		return;
	}

	// parcours des profils
	_.each(profiles, (obj) => {
		// création de la notif
		notificationManager.create(actionType, obj.userid, missionDoc._id);

		// si l'utilisateur est abonné aux notifs par e-mail, on le crée.
		if (obj.notifications && obj.notifications.newMissions && obj.notifications.newMissions === true) {
			emailNotification.sendEmailForAction(
				obj.userObj.emails[0].address,
				actionType,
				utils.getAbsoluteMissionUri(missionDoc._id),
				{
					'firstName': obj.contact.firstName,
					'missionName': missionDoc.name,
				});
		}
	});
}

/**
 * Notifie les administrateurs
 * @param {any} missionDoc
 * @param {any} action
 */
function notifyAdmins(missionDoc, actionType) {
	check(actionType, String);
	console.log(`[mission-notifier.notifyAdmins] - action.actionType: ${actionType}`);

	var admins = utils.getAdmins();
	if (!admins || admins.length == 0) {
		console.log("[mission-notifier.notifyAdmins] - Aucun administrateur trouvé");
		return;
	}

	// on récupère l'action à partir de l'id
	const action = Lists.actions.get(actionType);
	if (!action) {
		console.error(new Meteor.Error(500, `[mission-notifier.notifyAdmins] - Action non trouvée. [Id de l'action: ${actionType}]`));
		return;
	}

	// on parcourt le tableau des admins
	_.each(admins, (obj) => {
		// création de la notif
		notificationManager.create(actionType, obj._id, missionDoc._id);

		// création des données pour l'envoi du mail.
		emailNotification.sendEmailForAction(
			obj.emails[0].address,
			actionType,
			utils.getAbsoluteMissionUri(missionDoc._id),
			{
				'firstName': obj.username,
				'missionName': missionDoc.name,
			});
	});
}

export default {
	notifyAdmins,
	notifyMatchingProfiles,
};

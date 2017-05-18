import { check } from 'meteor/check';
import emailNotification from './email-notification.js';

const getUserProfiles = (skills) => {
	check(skills, Array);
	const selector = {
		isEnRecherche: true,
		"skills.name": { $in: skills }
	};
	const options = {
		'fields': { userid: 1, firstName: 1, },
		'transform': (doc) => {
			// on rajoute une propriété au document retourné
			doc.userObj = Meteor.users.findOne(doc.userid, { fields: { emails: 1 } });
			return doc;
		}
	};
	return UserProfiles
		.find(selector, options)
		.fetch();
};
const getAdmins = () => {
	var adminRole = Globals.roles.admin;
	console.log(`\tgetAdmins: adminRole = ${adminRole}`);
	return Roles.getUsersInRole(adminRole).fetch();
};
const getMissionUri = (missionId) => {
	return `https://www.indieit.fr${Utils.pathFor('mission', { '_id': missionId })}`;
}

/**
 * Notifie les utilisateurs potentiellement intéressés par la mission en cours
 * @param {any} missionDoc
 * @param {any} action
 */
function notifyMatchingProfiles(missionDoc, actionType) {

	check(actionType, String);
	console.log(`missionNotifier.notifyMatchingProfiles - action.actionType: ${actionType}`);

	var profiles = getUserProfiles(missionDoc.technos);

	if (!profiles || profiles.length == 0) {
		console.log("aucun profil ne correspond...");
		return;
	}

	_.each(profiles, (obj) => {
		var user = {
			'email': obj.userObj.emails[0].address,
			'firstName': obj.firstName,
		};
		emailNotification.sendEmailForAction(user, actionType, getMissionUri(missionDoc._id));
	});

}

/**
 * Notifie les administrateurs
 * @param {any} missionDoc
 * @param {any} action
 */
function notifyAdmins(missionDoc, actionType) {

	check(actionType, String);

	console.log(`missionNotifier.notifyAdmin - action.actionType: ${actionType}`);

	var admins = getAdmins();
	if (!admins || admins.length == 0) {
		console.log("\tAucun administrateur trouvé");
		return;
	}

	console.log("\tFound " + admins.length + " admins");

	// on parcourt le tableau des admins
	_.each(admins, (obj) => {
		var user = {
			'email': obj.emails[0].address,
			'firstName': obj.username
		};
		emailNotification.sendEmailForAction(user, actionType, getMissionUri(missionDoc._id));
	});
}

export default {
	notifyAdmins,
	//notifyMatchingProfiles,
};


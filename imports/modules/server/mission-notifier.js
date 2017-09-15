import { check } from 'meteor/check';
import emailNotification from './email-notification.js';
import escapeStringRegexp from 'escape-string-regexp';

const getUserProfiles = (skills) => {

	check(skills, Array);

	for (var i = 0; i < skills.length; i++) {
		skills[i] = escapeStringRegexp(skills[i]);
	}

	const regexStr = skills.join("|");
	console.log(regexStr);
	var regexObj = { $regex: regexStr, $options: "i"};
	const selector = {
		"search.isEnRecherche": true,
		"skills": { $elemMatch: { "name": regexObj } },
		"notifications.newMissions": true,
	};
	const options = {
		'fields': { userid: 1, contact: 1, search: 1, },
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
		var email = obj.userObj.emails[0].address;
		var tpldata = {
			'firstName': obj.contact.firstName,
			'missionName': missionDoc.name,
		};
		console.log(tpldata);
		emailNotification.sendEmailForAction(email, actionType, getMissionUri(missionDoc._id), tpldata);
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

	// on parcourt le tableau des admins
	_.each(admins, (obj) => {
		var email = obj.emails[0].address;
		var tpldata = {
			'firstName': obj.username,
			'missionName': missionDoc.name,
		};
		emailNotification.sendEmailForAction(email, actionType, getMissionUri(missionDoc._id), tpldata);
	});
}

export default {
	notifyAdmins,
	notifyMatchingProfiles,
};

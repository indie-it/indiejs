import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import SimpleSchema from 'simpl-schema';
import templateToHTML from './template-to-html.js';

const sendEmail = (template, { to, from, replyTo, subject, attachments }, payload) => {

	const email = {
		to,
		from: from || 'Indie IT <noreply@indieit.fr>',
		replyTo,
		subject,
		html: templateToHTML(template, payload),
	};

	if (attachments) email.attachments = attachments;

	Meteor.defer(() => {
		//console.log("sending e-mail... (not really sending e-mail)");
		Email.send(email);
	});
};

//const notifications = {

//	missionCreate({ to, firstName }, missionId) {

//		console.log("notifications.missionCreate");

//		const url = `https://www.indieit.fr${Utils.pathFor('mission', { '_id': missionId })}`;

//		console.log(`[notifications.missionCreate] url = ${url}`);

//		sendEmail('standard', {
//			to,
//			replyTo: ServerGlobals.smtp.username,
//			subject: '[Indie IT] Nouvelle mission Indie IT!',
//		}, {
//				title: 'Nouvelle mission sur Indie IT',
//				subtitle: 'Une nouvelle mission vient d\'arriver sur le réseau',
//				body: templateToHTML('mission-create', { firstName }),
//				callToAction: { url: url, label: 'Voir les détails de la mission', },
//			});
//	},
//	missionUpdate({ to, firstName }, missionId) {
//		console.log("notifications.missionUpdate");

//		const url = `https://www.indieit.fr${Utils.pathFor('mission', { '_id': missionId })}`;

//		console.log(`[notifications.missionUpdate] url = ${url}`);

//		sendEmail('standard', {
//			to,
//			replyTo: ServerGlobals.smtp.username,
//			subject: '[Indie IT] Mission Indie IT mise à jour!',
//		}, {
//				title: 'Mission mise à jour sur Indie IT',
//				subtitle: 'Une mission vient d\'être mise à jour sur Indie IT',
//				body: templateToHTML('mission-update', { firstName }),
//				callToAction: {
//					url: url,
//					label: 'Voir les détails de la mission',
//				},
//			});
//	},

//};

//export default function (type, user, missionId) {
//	const notification = notifications[type];
//	if (notification) {
//		notification(user, missionId);
//	}
//	else {
//		throw new Meteor.Error('500', "Désolé, cette notification n'existe pas.");
//	}
//}

function sendEmailForAction(user, actionType, missionUrl) {

	//new SimpleSchema({
	//	'email': { type: String, regEx: SimpleSchema.RegEx.Email },
	//	'firstName': String
	//}).validate({ user });

	//Lists.actions.schema.validate(action);

	//new SimpleSchema({ type: String, regEx: SimpleSchema.RegEx.Uri }).validate({ missionUrl });

	var action = Lists.actions.get(actionType);
	if (!action) {
		throw new Meteor.Error('500', "Action inconnue");
	}

	sendEmail('standard', {
		'to': user.email,
		'replyTo': ServerGlobals.smtp.username,
		'subject': `[Indie IT] ${action.title}`,
	}, {
			title: action.title,
			subtitle: action.subtitle,
			body: templateToHTML(action.id, { 'firstName': user.firstName }),
			callToAction: {
				'url': missionUrl,
				'label': 'Voir les détails de la mission',
			},
		});
}

export default {
	sendEmailForAction,
};
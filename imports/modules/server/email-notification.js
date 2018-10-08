import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import SimpleSchema from 'simpl-schema';
import templateToHTML from './template-to-html.js';
import { check } from 'meteor/check';

const sendEmail = (template, { to, from, replyTo, subject, attachments }, payload) => {
	const email = {
		to,
		from: from || 'Indie IT <noreply@indieit.fr>',
		replyTo,
		subject,
		html: templateToHTML(template, payload),
	};
	if (attachments) { email.attachments = attachments; }
	Meteor.defer(() => {
		Email.send(email);
	});
};

function sendEmailForAction(to, actionType, url, templateData) {

	var action = Lists.actions.get(actionType);
	if (!action) {
		throw new Meteor.Error('500', "Action inconnue");
	}

	var emailobj = {
		'to': to,
		'replyTo': ServerGlobals.smtp.username,
		'subject': `[Indie IT] ${action.title}`,
	};
	var payload = {
		'title': action.title,
		'subtitle': action.subtitle,
		'body': templateToHTML(action.id, templateData),
		'callToAction': {
			'url': url,
			'label': 'Voir les détails',
		},
	};
	sendEmail('standard', emailobj, payload);
}

function sendAdminEmail(mailinglist, title, html) {

	if (!mailinglist ) { mailinglist = 'test' };

	check([mailinglist, title, html], [String]);

	let to = '';
	if (mailinglist === 'test') {
		to = 'indieitblog@gmail.com';
	}
	else if (mailinglist === 'freelances') {

	}
	else if (mailinglist === 'admins') {

	}

	var emailobj = {
		'to': to,
		'replyTo': ServerGlobals.smtp.username,
		'subject': `Indie IT - ${title}`,
	};
	var payload = {
		'title': title,
		'body': html,
	};
	sendEmail('standard', emailobj, payload);
}

export default {
	sendEmailForAction,
	sendAdminEmail,
};

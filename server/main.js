import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
	console.log('\n\n#########################################################################');
	console.log(`#### ${new Date } ####`);
	console.log('#########################################################################');

	// POUR INFO :
	// Les objets/propriétés utilisés ici sont définis dans server/ lib / ServerGlobals.js)

	// config cloudinary 
	Cloudinary.config(ServerGlobals.cloudinary);
	Cloudinary.rules.delete = function () { return true; }

	// config serveur email 
	if (Meteor.absoluteUrl() === 'http://localhost:3000/') {
		console.log(`Fonctionnement en LOCAL sur ${Meteor.absoluteUrl()}`);
	} else {
		console.log(`Fonctionnement en PROD sur ${Meteor.absoluteUrl()}`);
		process.env.MAIL_URL = ServerGlobals.MAIL_URL();
	}

	// config templates Accounts
	Accounts.emailTemplates.siteName = Globals.appName;
	Accounts.emailTemplates.from = `Indie IT <${ServerGlobals.smtp.username}>`;
	Accounts.emailTemplates.enrollAccount.subject = (user) => {
		return `Bienvenue sue le site ${Globals.appName} ${user.username}`;
	};
	Accounts.emailTemplates.enrollAccount.text = (user, url) => {
		return 'Bonjour, vous avez été invité à rejoindre la communauté Indie IT.\n'
			+ ' Pour activer votre compte, cliquez sur le lien suivant :\n\n'
			+ url;
	};
	Accounts.emailTemplates.resetPassword.from = () => {
		// Overrides the value set in `Accounts.emailTemplates.from` when resetting
		// passwords.
		return `Indie IT <${ServerGlobals.smtp.username}>`;
	};
	Accounts.emailTemplates.resetPassword.text = (user, url) => {
		return `Bonjour ${user.username}!\n\n Pour effacer votre mot de passe et en créer un nouveau, cliquez simplement sur ce lien.\n\n ${url} \n\nMerci`;
	};
	Accounts.emailTemplates.resetPassword.subject = () => {
		return "Demande de remise à zéro de votre mot de passe";

	};
	Accounts.emailTemplates.verifyEmail = {
		subject() {
			return "Vérification d'adresse e-mail";
		},
		text(user, url) {
			return `Bonjour ${user.username}!\n\nVeuillez vérifier votre adresse e-mail en suivant ce lien:\n ${url} \n\nMerci`;
		},
	};
	Accounts.urls.resetPassword = (token) => {
		return Meteor.absoluteUrl(`password-recover/${token}`);
	};
	Accounts.urls.verifyEmail = (token) => {
		return Meteor.absoluteUrl(`email-verify/${token}`);
	};


});

import { check } from 'meteor/check';

Meteor.methods({

	"email.send": function (to, subject, text) {

		// petite vérif 1: il faut être connecté
		if (!Meteor.userId()) {
			throw new Meteor.Error(401, "Vous devez être connecté pour effectuer cette action");
		}

		const from = ServerGlobals.smtp.username;

		// petite vérif de routine 2: valider les paramètres.
		check([ServerGlobals.smtp.username, to, subject, text], [String]);

		// Let other method calls from the same client start running, without
		// waiting for the email sending to complete.
		this.unblock();

		Email.send({ to, from, subject, text });

	},

	"email.verify": function () {
		console.log("email.verify called!");

		// petite vérif 1: il faut être connecté
		if (!Meteor.userId()) {
			throw new Meteor.Error(401, "Vous devez être connecté pour effectuer cette action");
		}

		// Let other method calls from the same client start running, without
		// waiting for the email sending to complete.
		this.unblock();

		// envoi du mail de vérification !
		Accounts.sendVerificationEmail(Meteor.userId());
	},

});

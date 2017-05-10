import { check } from 'meteor/check';

Meteor.methods({

	"email.send": function (to, subject, text) {

		// petite vérif 1: il faut être connecté
		if (!Meteor.userId()) {
			this.unblock();
			return false;
		}

		const from = ServerGlobals.smtp.username;

		// petite vérif de routine 2: valider les paramètres.
		check([ServerGlobals.smtp.username, to, subject, text], [String]);

		// Let other method calls from the same client start running, without
		// waiting for the email sending to complete.
		this.unblock();

		Email.send({ to, from, subject, text });

	},

});

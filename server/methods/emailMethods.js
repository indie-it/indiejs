import { check } from 'meteor/check';

Meteor.methods({

	"email.send": function (to, subject, text) {

		// petite v�rif 1: il faut �tre connect�
		if (!Meteor.userId()) {
			throw new Meteor.Error(401, "Vous devez �tre connect� pour effectuer cette action");
		}

		const from = ServerGlobals.smtp.username;

		// petite v�rif de routine 2: valider les param�tres.
		check([ServerGlobals.smtp.username, to, subject, text], [String]);

		// Let other method calls from the same client start running, without
		// waiting for the email sending to complete.
		this.unblock();

		Email.send({ to, from, subject, text });

	},

	"email.verify": function () {
		console.log("email.verify called!");

		// petite v�rif 1: il faut �tre connect�
		if (!Meteor.userId()) {
			throw new Meteor.Error(401, "Vous devez �tre connect� pour effectuer cette action");
		}

		// Let other method calls from the same client start running, without
		// waiting for the email sending to complete.
		this.unblock();

		// envoi du mail de v�rification !
		Accounts.sendVerificationEmail(Meteor.userId());
	},

});

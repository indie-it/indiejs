import { check } from 'meteor/check';

Meteor.methods({

	"email.send": function (to, subject, text) {

		// petite v�rif 1: il faut �tre connect�
		if (!Meteor.userId()) { return false; }

		const from = "Indie IT <indieitblog@gmail.com>";

		// petite v�rif de routine 2: valider les param�tres.
		check([from, to, subject, text], [String]);

		// Let other method calls from the same client start running, without
		// waiting for the email sending to complete.
		this.unblock();

		Email.send({ to, from, subject, text });
	},

});

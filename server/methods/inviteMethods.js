//import SimpleSchema from 'simpl-schema';
//import { check } from 'meteor/check';
//import { Random } from 'meteor/random';

//Meteor.methods({

//	"invite.send": function (inviteDoc) {

//		console.log("invite.send called");

//		inviteDoc.userid = this.userId;
//		inviteDoc.createdAt = new Date();
//		inviteDoc.token = Random.id();

//		Globals.schemas.InvitationSchema.validate(inviteDoc);

//		// 2ème vérif: on doit vérifier que l'utilisateur n'est pas déjà dans le système (user)
//		var user = Accounts.findUserByEmail(inviteDoc.email);
//		if (user) {
//			throw new Meteor.Error("Un utilisateur existe déjà avec cette adresse e-mail.");
//		}

//		// 3ème vérif: déjà dans les invités?
//		var guest = Invitation.findOne({ 'email': inviteDoc.email });
//		if (guest) {
//			throw new Meteor.Error("Cette adresse e-mail est déjà référencée.");
//		}

//		// Let other method calls from the same client start running, without
//		// waiting for the email sending to complete.
//		this.unblock();

//		const from = ServerGlobals.smtp.username;
//		const to = inviteDoc.email;
//		const subject = ServerGlobals.invite.subject();
//		const url = Meteor.absoluteUrl('');
//		const text = ServerGlobals.invite.text(this.userId, inviteDoc.firstName, inviteDoc.lastName, url);

//		// petite vérif de routine 2: valider les paramètres.
//		check([from, to, subject, text], [String]);

//		Email.send({ to, from, subject, text });



//		// insertion en base
//		Invitation.insert(inviteDoc, function (err, objectid) {
//			if (err) { throw new Meteor.Error(500, err.message); }
//		});
//	},

//});
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';

Meteor.methods({

	"invite.send": function (inviteDoc) {

		console.log("invite.send called");

		inviteDoc.userid = this.userId;
		inviteDoc.createdAt = new Date();
		inviteDoc.token = Random.id();

		Globals.schemas.InvitationSchema.validate(inviteDoc);

		// 2ème vérif: on doit vérifier que l'utilisateur n'est pas déjà dans le système (user)
		var user = Accounts.findUserByEmail(inviteDoc.email);
		if (user) {
			throw new Meteor.Error("Un utilisateur existe déjà avec cette adresse e-mail.");
		}

		// insertion en base
		return Invitation.insert(inviteDoc, function (err, objectid) {

			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			Actions.insert({
				actionType: Lists.actions.map.inviteCreate,
				userid: Meteor.userId(),
			}, function (err, objId) {
				if (err) {
					console.error(err);
				}
				console.log("Action enregistrée");
			});

		});
	},

});
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';

Invitation = new Mongo.Collection("invites");
Invitation.deny({
	insert: function () {
		return true;
	},
	update: function () {
		return true;
	},
	remove: function () {
		return true;
	}
})

Globals.schemas.InvitationSchema = new SimpleSchema({

	// l'utilisateur qui lance l'invitation
	userid: {
		type: String,
		label: "Id utilisateur",
		autoValue: function () {
			if (this.isInsert) {
				return Meteor.userId();
			} else if (this.isUpsert) {
				return {
					$setOnInsert: Meteor.userId()
				};
			} else {
				this.unset();
			}
		},
		autoform: {
			omit: true
		},
	},

	// date d'envoi de l'invitation
	createdAt: {
		type: Date,
		label: "Date d'envoi de l'invitation",
		autoValue: function () {
			if (this.isInsert) {
				return new Date;
			} else if (this.isUpsert) {
				return {
					$setOnInsert: new Date
				};
			} else {
				this.unset();
			}
		},
		autoform: {
			omit: true
		}
	},

	// jeton d'invitation
	token: {
		type: String,
		label: "Jeton d'invitation",
		autoValue: function () {
			if (this.isInsert) {
				return Random.id();
			} else if (this.isUpsert) {
				return {
					$setOnInsert: Random.id()
				};
			} else {
				this.unset();
			}
		},
	},

	firstName: {
		type: String,
		label: "Prénom",
	},

	lastName: {
		type: String,
		label: "Nom",
	},

	email: {
		type: String,
		label: "Adresse e-mail",
		regEx: SimpleSchema.RegEx.Email,
	},

	message: {
		type: String,
		label: "Message personnalisé",
		autoform: { afFieldInput: { type: "textarea", rows: 5 } },
		optional: true,
	},


});
Invitation.attachSchema(Globals.schemas.InvitationSchema);





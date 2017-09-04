import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Tos = new Mongo.Collection('tos');

// sécurité renforcée : on va effectuer ces tâches via des méthodes Meteor.
Tos.deny({
	insert: function () { return true; },
	update: function () { return true; },
	remove: function () { return true; },
});

// Schéma du profil
Globals.schemas.TosSchema = new SimpleSchema({
    userid: {
		type: String,
		label: "Identifiant utilisateur",
		autoform: {
			omit: true
		},
		optional: false,
	},
	username: {
		type: String,
		label: "Nom d'utilisateur",
		autoform: {
			omit: true
		},
		optional: false,
	},
	accepted: {
		type: Boolean,
		label: "CGU acceptées",
		optional: false,
	},
	date: {
		type: Date,
		label: "Date d'acceptation",
		optional: false,
		autoValue: function () {
			if (this.isInsert) {
				return new Date;
			} else {
				this.unset();
			}
		},
		autoform: {
			omit: true
		},
	},
});
Tos.attachSchema(Globals.schemas.TosSchema);

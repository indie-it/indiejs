import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);


// Schéma Utilisateur Meteor
Globals.schemas.UsersSchema = new SimpleSchema({
	username: {
		type: String,
		regEx: /^[a-z0-9A-Z_]{3,15}$/,
		label: "Nom d'utilisateur"
	},
	password: {
		type: String,
		label: "Mot de passe",
		optional: true,
		autoform: {
			afFieldInput: {
				type: "password"
			}
		}
	},
	confirmation: {
		type: String,
		label: "Confirmation",
		optional: true,
		custom: function () {
			if (this.value !== this.field('password').value) {
				return "passwordMissmatch";
			}
		},
		autoform: {
			afFieldInput: {
				type: "password"
			}
		}
	},


	email: {
		type: Object,
		optional: true,
	},
	"email.address": {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		label: "Adresse",
	},
	"email.verified": {
		type: Boolean,
		optional: true,
		autoform: {
			omit: true
		},
	},


	emails: {
		type: Array,
		// For accounts-password, either emails or username is required, but not both. It is OK to make this
		// optional here because the accounts-password package does its own validation.
		// Third-party login packages may not require either. Adjust this schema as necessary for your usage.
		optional: true
	},
	"emails.$": Object,
	"emails.$.address": {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		label: "Adresse"
	},
	"emails.$.verified": {
		type: Boolean,
		optional: true,
		autoform: {
			omit: true
		}
	},

	profile: {
		type: Object,
		label: "Profil",
		optional: true
	},
	"profile.companyName": {
		type: String,
		label: "Nom de société",
	},
	"profile.lastName": {
		type: String,
		label: "Nom",
	},
	"profile.firstName": {
		type: String,
		label: "Prénom"
	},
	"profile.telephone": {
		type: String,
		label: "Téléphone"
	},
	"profile.service": {
		type: String,
		label: "Service",
		optional: true,
	},

	createdAt: {
		type: Date,
		autoValue: function () {
			if (this.isInsert) {
				return new Date();
			} else {
				this.unset();
			}
		},
		autoform: {
			omit: true
		}
	},

	roles: {
		type: Array,
		optional: true
	},
	'roles.$': {
		type: String
	},

	services: {
		type: Object,
		optional: true,
		blackbox: true,
		autoform: {
			omit: true
		}
	},

	// In order to avoid an 'Exception in setInterval callback' from Meteor
	heartbeat: {
		type: Date,
		optional: true
	}
});

// On attache ce schéma à la collection
Meteor.users.attachSchema(Globals.schemas.UsersSchema);

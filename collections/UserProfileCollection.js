import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

UserProfiles = new Mongo.Collection('userProfiles');

// sécurité renforcée : on va effectuer ces tâches via des méthodes Meteor.
UserProfiles.deny({
	insert: function() {
		return true;
	},
	update: function() {
		return true;
	},
	remove: function() {
		return true;
	}
});

// SimpleSchema.messages({
// 	"userprofile.availDateMissing": "Le champ 'Date de disponibilité' doit être rempli lorsque le champ 'Disponible' n'est pas coché."
// });

// Schéma du profil
Globals.schemas.UserProfileSchema = new SimpleSchema({

	firstName: {
		type: String,
		regEx: /^[a-zA-Z-]{2,25}/,
		label: "Prénom"
	},
	lastName: {
		type: String,
		regEx: /^[a-zA-Z-]{2,25}/,
		label: "Nom"
	},
	birthday: {
		type: Date,
		optional: true,
		label: "Date de naissance"
	},
	title: {
		type: String,
		label: "Titre du profil",
		max: 255
	},
	description: {
		type: String,
		label: "Description",
		autoform: {
			afFieldInput: {
				type: "textarea",
				rows: 5
			}
		}
	},
	userid: {
		type: String,
		label: "Identifiant utilisateur",
		autoform: {
			omit: true
		},
		autoValue: function() {
			if (this.isInsert) {
				return Meteor.userId();
			} else {
				this.unset();
			}
		}
	},
	createdAt: {
		type: Date,
		autoValue: function() {
			if (this.isInsert) {
				return new Date;
			} else {
				this.unset();
			}
		},
		autoform: {
			omit: true
		}
	},
	updated: {
		type: Date,
		label: "Date de mise à jour",
		autoValue: function() {
			// if (this.isUpdate) {
			return new Date;
			// }
		},
		optional: true,
		autoform: { // Ne soit pas apparaitre dans le formulaire
			omit: true
		}
	},

	isEnRecherche: {
		type: Boolean,
		label: "En recherche de mission ?"
	},
	isAvailable: {
		type: Boolean,
		label: "Disponible"
	},
	availDate: {
		type: Date,
		label: "Date de disponibilité",
		optional: true,
		custom: function() {
			var isAvailable = this.field('isAvailable').value;
			console.log("### isAvailable: " + isAvailable + ", this.value: " + this.value);
			if (!this.value && isAvailable === false) {
				return "Le champ 'Date de disponibilité' doit être rempli lorsque le champ 'Disponible' n'est pas coché.";
			}
		}
	},

	// gender: {
	// 	type: String,
	// 	allowedValues: ['M', 'F'],
	// 	optional: true,
	// 	label: "Genre",
	// 	autoform: {
	// 		afFieldInput: {
	// 			type: "select2", // type de champ particulier, voir plus bas
	// 			options: [
	// 				{
	// 					value: "M",
	// 					label: "Homme"
	//                   },
	// 				{
	// 					value: "F",
	// 					label: "Femme"
	//                   }
	//             ]
	// 		}
	// 	}
	// },

	skills: {
		type: Array,
		label: "Compétences",
		optional: true
	},
	"skills.$": {
		type: Object,
		label: "Compétence"
	},
	"skills.$.name": {
		type: String,
		minCount: 1,
		label: 'Compétence',
		autoform: {
			type: 'select2',
			multiple: false,
			options: Lists.technos
		}
	},
	"skills.$.name.$": String,
	"skills.$.level": {
		type: Number,
		label: "Niveau",
		min: 1,
		max: 10
	},

	// formation/éducation

	"education": {
		type: Array,
		label: "Formation",
		optional: true
	},
	"education.$": {
		type: Object,
		label: "Formation"
	},
	"education.$.date": {
		type: Date,
		label: "Date",
	},
	"education.$.title": {
		type: String,
		max: 255,
		label: "Intitulé formation"
	},
	"education.$.school": {
		type: String,
		max: 255,
		label: "Ecole"
	},
	"education.$.city": {
		type: String,
		label: "Ville"
	},
	"education.$.levels": {
		type: String,
		label: "Niveau",
		autoform: {
			type: 'select2',
			options: Lists.educationLevels
		}
	},

	// expériences

	experiences: {
		type: Array,
		label: "Expériences/Missions",
		optional: true
	},
	"experiences.$": {
		type: Object,
		label: "Expérience"
	},
	"experiences.$.title": {
		type: String,
		label: "Titre du poste ou de la mission",
		max: 255
	},
	"experiences.$.company": {
		type: String,
		label: "Société",
		max: 255
	},
	"experiences.$.start": {
		type: Date,
		label: "Début",
	},
	"experiences.$.end": {
		type: Date,
		label: "Fin",
		optional: true,
	},
	"experiences.$.isCurrent": {
		type: Boolean,
		label: "Poste ou mission actuel(le)"
	},
	"experiences.$.description": {
		type: String,
		label: "Description",
		autoform: {
			afFieldInput: {
				type: "textarea",
				rows: 10
			}
		}
	},
	"experiences.$.skills": {
		type: Array,
		minCount: 1,
		label: 'Technologies concernées',
		autoform: {
			type: 'select2',
			multiple: true,
			options: Lists.technos
		}
	},
	"experiences.$.skills.$": String,

});
UserProfiles.attachSchema(Globals.schemas.UserProfileSchema);


// Schéma principal
Globals.schemas.UserSchema = new SimpleSchema({
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
		custom: function() {
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
	emails: {
		type: Array,
		// For accounts-password, either emails or username is required, but not both. It is OK to make this
		// optional here because the accounts-password package does its own validation.
		// Third-party login packages may not require either. Adjust this schema as necessary for your usage.
		optional: true
	},
	"emails.$": {
		type: Object
	},
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
	createdAt: {
		type: Date,
		autoValue: function() {
			if (this.isInsert) {
				return new Date;
			} else {
				this.unset();
			}
		},
		autoform: {
			omit: true
		}
	},
	// profile: {
	// 	type: Globals.schemas.UserProfileSchema,
	// 	optional: true
	// },
	services: {
		type: Object,
		optional: true,
		blackbox: true,
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
	// In order to avoid an 'Exception in setInterval callback' from Meteor
	heartbeat: {
		type: Date,
		optional: true
	}
});

// On attache ce schéma à la collection
Meteor.users.attachSchema(Globals.schemas.UserSchema);

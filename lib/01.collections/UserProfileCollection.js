import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

UserProfiles = new Mongo.Collection('userProfiles');

// sécurité renforcée : on va effectuer ces tâches via des méthodes Meteor.
UserProfiles.deny({
	insert: function () {
		return true;
	},
	update: function () {
		return true;
	},
	remove: function () {
		return true;
	}
});

// Schéma du profil
Globals.schemas.UserProfilesSchema = new SimpleSchema({

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
		optional: true,
		autoform: {
			afFieldInput: {
				type: "textarea",
				rows: 5
			}
		}
	},
	location: {
		type: String,
		label: "Ville",
		optional: true,
	},
	industry: {
		type: String,
		label: "Secteur professionnel",
		optional: true,
	},
	specialties: {
		type: String,
		label: "Spécialités",
		optional: true,
	},
	private: {
		type: Boolean,
		optional: true,
		label: "Profil privé?",
	},

	userid: {
		type: String,
		label: "Identifiant utilisateur",
		autoform: {
			omit: true
		},
		autoValue: function () {
			if (this.isInsert) {
				return Meteor.userId();
			}
			//else if (this.isUpsert) {
			//	return Meteor.userId();
			//}
			else {
				this.unset();
			}
		},
		optional: true,
	},
	createdAt: {
		type: Date,
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
		optional: true,
	},
	updated: {
		type: Date,
		label: "Date de mise à jour",
		autoValue: function () {
			// if (this.isUpdate) {
			return new Date();
			// }
		},
		optional: true,
		autoform: { // Ne soit pas apparaitre dans le formulaire
			omit: true
		}
	},

	isEnRecherche: {
		type: Boolean,
		label: "En recherche de mission ?",
		autoValue: function () {
			if (this.isUpsert) {
				return true;
			} else {
				this.unset();
			}
		},
		optional: true,
	},
	isAvailable: {
		type: Boolean,
		label: "Disponible",
		defaultValue: function () {
			return true;
		},
		optional: true,
	},
	availDate: {
		type: Date,
		label: "Date de disponibilité",
		optional: true,
		custom: function () {
			var isAvailable = this.field('isAvailable').value;
			if (!this.value && isAvailable === false) {
				return "Le champ 'Date de disponibilité' doit être rempli lorsque le champ 'Disponible' n'est pas coché.";
			}
		}
	},
	categories: {
		type: Array,
		minCount: 1,
		label: "Catégories",
		optional: true,
		autoform: {
			type: 'select2',
			multiple: true,
			options: Lists.categories
		}
	},
	'categories.$': String,

	skills: {
		type: Array,
		label: "Compétences",
		optional: true
	},
	"skills.$": {
		type: Object,
		label: "Compétence"
	},
	"skils.$.order": {
		type: Number,
		label: "Ordre",
		optional: true,
		autoform: {
			omit: true
		},
	},
	"skills.$.name": {
		type: String,
		label: "Compétence",
	},
	"skills.$.level": {
		type: Number,
		label: "Niveau (de 1 à 10)",
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


	// Profil pic ! 
	profilePic: {
		type: Object,
		label: "Image de profil",
		optional: true,
		autoform: {
			omit: true
		}
	},
	"profilePic.size": Number,
	//"profilePic.createdAt": Date,
	"profilePic.etag": String,
	"profilePic.format": String,
	"profilePic.height": Number,
	"profilePic.publicId": String,
	"profilePic.resourceType": String,
	"profilePic.secureUrl": String,
	"profilePic.signature": String,
	"profilePic.type": String,
	"profilePic.url": String,
	"profilePic.version": Number,
	"profilePic.width": Number,


});
UserProfiles.attachSchema(Globals.schemas.UserProfilesSchema);


// Schéma principal
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

	companyName: {
		type: String,
		label: "Nom de société",
		optional: true,
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
Meteor.users.attachSchema(Globals.schemas.UsersSchema);

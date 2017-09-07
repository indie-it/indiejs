import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

UserProfiles = new Mongo.Collection('userProfiles');

// sécurité renforcée : on va effectuer ces tâches via des méthodes Meteor.
UserProfiles.deny({
	insert: function () { return true; },
	update: function () { return true; },
	remove: function () { return true; }
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
	isPrivate: {
		type: Boolean,
		optional: true,
		label: "Profil privé?",
	},
	telephone: {
		type: String,
		label: "Téléphone",
		regEx: /^(0|\+33|0033)[1-9][0-9]{8}/,
		optional: true,
	},
	skype: {
		type: String,
		label: "Pseudo Skype",
		optional: true,
	},
	website: {
		type: String,
		label: "Site web",
		regEx: SimpleSchema.RegEx.Url,
		optional: true,
	},
	tjm: {
		type: Number,
		label: "Taux Journalier Moyen (en €/j)",
		optional: true,
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

	isCertified: {
		type: Boolean,
		label: "Profil certifié ?",
		autoValue: function () {
			if (this.isInsert) {
				return false;
			}
			// if (this.isUpsert) {
			// 	return false;
			// }
			this.unset();
		},
		optional: true,
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
		defaultValue: true,
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
		},
		autoValue: function () {
			if (this.isUpdate) {
				var isAvailable = this.field('isAvailable').value;
				console.log(`[availDate.autoValue] isAvailable: ${isAvailable}, this.value: ${this.value}`);
				if (this.value && isAvailable === true) {
					return null;
				}
			}
		},
	},
	categories: {
		type: Array,
		minCount: 1,
		label: "Catégories",
		optional: true,
		autoform: {
			type: 'select2',
			multiple: true,
			options: Lists.categories.dropdownValues
		}
	},
	'categories.$': String,

	skills: {
		type: Array,
		label: "Compétences",
		optional: true,
	},
	"skills.$": {
		type: Globals.schemas.SkillSchema,
		label: "Compétence"
	},

	// formation/éducation
	"education": {
		type: Array,
		label: "Formation",
		optional: true
	},
	"education.$": {
		type: Globals.schemas.EducationSchema,
		label: "Formation"
	},

	// expériences
	experiences: {
		type: Array,
		label: "Expériences/Missions",
		optional: true
	},
	"experiences.$": {
		type: Globals.schemas.ExperienceSchema,
		label: "Expérience"
	},

	// Profil pic !
	profilePic: {
		type: Globals.schemas.CloudinaryProfilePicSchema,
		label: "Image de profil",
		optional: true,
		autoform: {
			omit: true
		}
	},

});
UserProfiles.attachSchema(Globals.schemas.UserProfilesSchema);

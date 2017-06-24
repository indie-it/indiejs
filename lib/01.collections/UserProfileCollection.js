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
			options: Lists.categories.dropdownValues
		}
	},
	'categories.$': String,

	// skills

	skills: {
		type: Array,
		label: "Compétences",
		optional: true,
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
		//minCount: 1,
		//maxCount: 1,
		//autoform: {
		//	type: 'select2',
		//	select2Options: { tags: true },
		//	multiple: false,
		//	options: Lists.technos
		//}
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
			select2Options: {
				tags: true,
			},
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

	// notifs/alertes 
	alert: {
		type: Object,
		label: "Alerte",
		optional: true,
		autoform: { omit: true },
	},
	"alert.isMissionNew": Boolean,
	"alert.isMissionDone": Boolean,
	"alert.isMissionAssigned": Boolean,
	"alert.isMissionArchived": Boolean,

	isCertified: {
		type: Boolean,
		label: "Profil certifié ?",
		autoValue: function () {

			if (this.isInsert) {
				return false;

			}

			if (this.isUpsert) {
				return false;
			}

			this.unset();

		},
		optional: true,
	},
});
UserProfiles.attachSchema(Globals.schemas.UserProfilesSchema);



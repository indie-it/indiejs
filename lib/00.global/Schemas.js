import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

// SimpleSchema.debug = true;

Globals.schemas.EducationSchema = new SimpleSchema({
	"date": {
		type: Date,
		label: "Date",
	},
	"title": {
		type: String,
		max: 255,
		label: "Intitulé formation"
	},
	"school": {
		type: String,
		max: 255,
		label: "Ecole"
	},
	"city": {
		type: String,
		label: "Ville"
	},
	"levels": {
		type: String,
		label: "Niveau",
		autoform: {
			type: 'select2',
			options: Lists.educationLevels
		}
	},
});
Globals.schemas.ExperienceSchema = new SimpleSchema({
	"title": {
		type: String,
		label: "Titre du poste ou de la mission",
		max: 255
	},
	"company": {
		type: String,
		label: "Société",
		max: 255
	},
	"start": {
		type: Date,
		label: "Début",
	},
	"end": {
		type: Date,
		label: "Fin",
		optional: true,
	},
	"isCurrent": {
		type: Boolean,
		label: "Poste ou mission actuel(le)"
	},
	"description": {
		type: String,
		label: "Description",
		autoform: {
			afFieldInput: {
				type: "textarea",
				rows: 10
			}
		}
	},
	"skills": {
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
	"skills.$": String,
});
Globals.schemas.SkillSchema = new SimpleSchema({
	"order": {
		type: Number,
		label: "Ordre",
		optional: true,
		autoform: {
			omit: true
		},
	},
	"name": {
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
	"level": {
		type: Number,
		label: "Niveau (de 1 à 10)",
		min: 1,
		max: 10
	},
});
Globals.schemas.CloudinaryProfilePicSchema = new SimpleSchema({
	//"profilePic.createdAt": Date,
	"size": Number,
	"etag": String,
	"format": String,
	"height": Number,
	"publicId": String,
	"resourceType": String,
	"secureUrl": String,
	"signature": String,
	"type": String,
	"url": String,
	"version": Number,
	"width": Number,
});
Globals.schemas.PersonSchema = new SimpleSchema({
	"firstName": {
		type: String,
		label: "Prénom"
	},
	"lastName": {
		type: String,
		label: "Nom",
	},
	"telephone": {
		type: String,
		label: "Téléphone"
	},
});
Globals.schemas.CompanyProfileSchema = new SimpleSchema({
	"type": {
		type: String,
		allowedValues: Lists.roles.ids,
		label: "Type de profil",
		autoform: { omit: true },
		optional: true,
	},
	"name": {
		type: String,
		label: "Nom de société",
	},
	"telephone": {
		type: String,
		label: "Téléphone"
	},
	"service": {
		type: String,
		label: "Service",
		optional: true,
	},
	"siret": {
		type: String,
		label: "N° SIRET",
		optional: true,
	},

});
Globals.schemas.AddressSchema = new SimpleSchema({
	'street': {
		type: String,
		label: "Rue",
	},
	'city': {
		type: String,
		label: "Ville",
	},
	'postcode': {
		type: String,
		label: "Code Postal",
		regEx: /^(([0-8][0-9])|(9[0-5])|(2[ab]))[0-9]{3}$/,
	},
});
Globals.schemas.ContactSchema = new SimpleSchema({
	'firstName': {
		type: String,
		regEx: /^[a-zA-Z-]{2,25}/,
		label: "Prénom",
	},
	'lastName': {
		type: String,
		regEx: /^[a-zA-Z-]{2,25}/,
		label: "Nom",
	},
	'dob': {
		type: Date,
		optional: true,
		label: "Date de naissance",
	},
	'address': {
		type: Globals.schemas.AddressSchema,
		label: "Adresse",
		optional: true,
	},
	'telephone': {
		type: String,
		label: "Téléphone",
		regEx: /^(0|\+33|0033)[1-9][0-9]{8}/,
		optional: true,
	},
	'skype': {
		type: String,
		label: "Pseudo Skype",
		optional: true,
	},
	'website': {
		type: String,
		label: "Site web",
		regEx: SimpleSchema.RegEx.Url,
		optional: true,
	},
});
Globals.schemas.AverageDailyRateRangeSchema = new SimpleSchema({
	"min": {
		type: Number,
		label: "TJM Brut Minimum",
		optional: true,
	},
	"max": {
		type: Number,
		label: "TJM Brut Maximum",
		optional: true,
	},

});
Globals.schemas.FreelanceSearchSchema = new SimpleSchema({
	'isEnRecherche': {
		type: Boolean,
		label: "Je suis en recherche de mission",
		autoValue: function () {
			if (this.isInsert) {
				return true;
			}
		},
		optional: true,
	},
	'categories': {
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
	'location': {
		type: String,
		label: "Zone géographique",
		optional: true,
	},
	'technos': {
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
		},
		optional: true,
	},
	'technos.$': String,
	'start': {
		type: Date,
		label: "Démarrage à partir du",
		optional: true,
	},
	'type': {
		type: String,
		label: "Type de mission",
		allowedValues: ['Régie', 'Forfait'],
		autoform: {
			type: 'select',
			options: function () {
				return [{ label: "Régie", value: "Régie" }, { label: "Forfait", value: "Forfait" }];
			}
		},
		optional: true,
	},
	'level': {
		type: Number,
		label: "Niveau",
		optional: true,
		autoform: {
			type: 'select',
			options: Lists.skillLevel.dropdownValuesForSearch,
		},
	},
	'tjm':{
		type: Globals.schemas.AverageDailyRateRangeSchema,
		label: "Fourchette TJM",
		optional: true,
	},
	'field': {
		type: String,
		label: "Domaine professionnel",
		optional: true
	},
});
Globals.schemas.FreelanceProfileSchema = new SimpleSchema({
	'isAvailable': {
		type: Boolean,
		label: "Je suis actuellement disponible",
		defaultValue: true,
		optional: true,
	},
	'availDate': {
		type: Date,
		label: "Date de disponibilité",
		optional: true,
		custom: function () {
			var isAvailable = this.siblingField('isAvailable').value;
			if (!this.value && isAvailable === false) {
				return "Le champ 'Date de disponibilité' doit être rempli lorsque le champ 'Disponible' n'est pas coché.";
			}
		},
		autoValue: function () {
			if (this.isUpdate) {
				var isAvailable = this.siblingField('isAvailable').value;
				console.log(`[availDate.autoValue] isAvailable: ${isAvailable}, this.value: ${this.value}`);
				//console.log(this.siblingField('isAvailable'));
				if (this.value && isAvailable === true) {
					return null;
				}
			}
		},
	},
	'title': {
		type: String,
		label: "Titre du profil",
		max: 255,
		optional: true,
	},
	'description': {
		type: String,
		label: "Description",
		optional: true,
		autoform: {
			afFieldInput: {
				type: "textarea",
				rows: 5
			}
		},
	},
	'isCertified': {
		type: Boolean,
		label: "Profil certifié ?",
		autoValue: function () {
			if (this.isInsert) {
				return false;
			}
			this.unset();
		},
		optional: true,
		autoform: { omit: true },
	},
	'level': {
		type: Number,
		label: "Niveau de compétences",
		optional: true,
		autoform: {
			type: 'select',
			options: Lists.skillLevel.dropdownValuesForFreelance,
		},
	},
	'categories': {
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
	'tjm': {
		type: Number,
		label: "Taux Journalier Moyen Brut en €/j (avant commission)",
		optional: true,
	},});
Globals.schemas.FreelanceNotificationsSchema = new SimpleSchema({
	'newsletters': {
		type: Boolean,
		label: "Je veux recevoir les newsletters Indie IT",
		optional: true,
	},
	'newMissions': {
		type: Boolean,
		label: "Je veux recevoir par e-mail les nouvelles missions Indie IT",
		optional: true,
	},
	'events': {
		type: Boolean,
		label: "Je veux recevoir par e-mail les évènements Indie IT",
		optional: true,
	},
});

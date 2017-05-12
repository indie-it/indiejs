import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Missions = new Mongo.Collection("mission");
Missions.deny({
	insert: function () { return true; },
	update: function () { return true; },
	remove: function () { return true; }
});
Missions.allow({
	insert: function () { return false; },
	update: function () { return false; },
	remove: function () { return false; }
});

Globals.schemas.MissionSchema = new SimpleSchema({

	name: {
		type: String,
		label: "Nom de la mission",
		max: 120
	},
	technos: {
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
	'technos.$': String,
	categories: {
		type: Array,
		minCount: 1,
		maxCount: 1,
		label: "Catégories",
		autoform: {
			type: 'select2',
			options: Lists.categories.dropdownValues
		}
	},
	'categories.$': String,
	shortDescription: {
		type: String,
		label: "Description (courte)",
		max: 255,
		optional: true
	},
	description: {
		type: String,
		label: "Description de la mission",
		max: 2000,
		autoform: {
			afFieldInput: {
				type: "textarea",
				rows: 10
			}
		}
	},
	start: {
		type: Date,
		label: "Date de démarrage",
		optional: true
		// autoform: {
		// 	afFieldInput: {
		// 		type: "bootstrap-datepicker",
		// 		datePickerOptions: {
		// 			weekStart: 1,
		// 			"data-date-autoclose": "true",
		// 			// autoclose: true,
		// 			format: 'dd/mm/yyyy',
		// 			language: "fr-FR",
		// 			startDate: new Date(),
		// 			clearBtn: true
		// 		}
		// 	}
		// }
	},
	isEarliestStart: {
		type: Boolean,
		label: "Démarrage au plus tôt"
	},
	type: {
		type: String,
		label: "Type de mission",
		allowedValues: ['Régie', 'Forfait'],
		autoform: {
			type: 'select',
			options: function () {
				return [{
					label: "Régie", value: "Régie"
				}, {
					label: "Forfait", value: "Forfait"
				}];
			}
		}
	},
	level: {
		type: String,
		label: "Niveau",
		optional: true,
		allowedValues: ['tous-niveaux', 'débutant', 'intermédiaire', 'avancé', 'expert'],
		autoform: {
			type: 'select',
			options: function () {
				return [
					{ label: 'Tous niveaux', value: 'tous-niveaux' },
					{ label: 'Débutant', value: 'débutant' },
					{ label: 'Intermédiaire', value: 'intermédiaire' },
					{ label: 'Avancé', value: 'avancé' },
					{ label: 'Expert', value: 'expert' },
				];
			}
		}
	},
	organization: {
		type: String,
		max: 255,
		optional: true,
		label: "Société"
	},
	duration: {
		type: SimpleSchema.Integer,
		label: "Durée de la mission (en jours)",
		optional: true
	},
	//averageDailyRate: {
	//	type: Number,
	//	label: "TJM Brut (avant commission)",
	//	optional: true
	//},

	averageDailyRate: {
		type: Object,
		label: "TJM Brut (avant commission)",
		optional: true,
	},
	"averageDailyRate.min": {
		type: Number,
		label: "TJM Brut Minimum",
		optional: true,
	},
	"averageDailyRate.max": {
		type: Number,
		label: "TJM Brut Maximum",
		optional: true,
	},

	field: {
		type: String,
		label: "Domaine professionnel",
		optional: true
	},
	location: {
		type: String,
		label: "Lieu de la mission",
		optional: true
	},

	createdAt: {
		type: Date,
		label: "Date de création",
		autoValue: function () {
			if (this.isInsert) {
				return new Date();
			} else if (this.isUpsert) { // ... ou sur les "upserts"
				return {
					$setOnInsert: new Date()
				};
			} else {
				this.unset(); // Sinon on ne touche pas au champs
			}
		},
		autoform: { // Ne doit pas apparaitre dans le formulaire
			omit: true
		}
	},
	updated: {
		type: Date,
		label: "Date de mise à jour",
		autoValue: function () {
			//if (this.isUpdate) {
			return new Date;
			//}
		},
		optional: true,
		autoform: { // Ne soit pas apparaitre dans le formulaire
			omit: true
		}
	},

	authorId: {
		type: String,
		label: "Créé par (id)",
		autoform: {
			omit: true
		},
		autoValue: function () {
			if (this.isInsert) {
				return Meteor.userId();
			} else {
				this.unset(); // Sinon on ne touche pas au champs
			}
		}
	},
	authorName: {
		type: String,
		label: "Créé par (nom)",
		autoform: {
			omit: true
		},
		autoValue: function () {
			if (this.isInsert) {
				return Meteor.user().username;
			} else {
				this.unset(); // Sinon on ne touche pas au champs
			}
		}
	},

	interestedUserIds: {
		type: Array,
		label: "Utilisateurs intéressés",
		optional: true,
		autoform: {
			omit: true
		}
	},
	"interestedUserIds.$": {
		type: String
	},
	notinterestedUserIds: {
		type: Array,
		label: "Utilisateurs pas intéressés",
		optional: true,
		autoform: {
			omit: true
		}
	},
	"notinterestedUserIds.$": {
		type: String
	},

	currentState: {
		type: Object,
		label: "Etape en cours",
		autoform: {
			omit: true
		},
		optional: true
	},
	"currentState.step": String,
	"currentState.date": Date,
	"currentState.assignedUserId": { type: String, optional: true },

	workflowHistory: { type: Array, label: "Journal des étapes", autoform: { omit: true }, optional: true, },
	"workflowHistory.$": Object,
	"workflowHistory.$.step": { type: String, allowedValues: Lists.missionWorkflow.ids, label: "Etape"},
	"workflowHistory.$.date": Date,
	"workflowHistory.$.assignedUserId": { type: String, optional: true },


	// lorsqu'une mission est proposée par une entreprise, on stocke le companyId:
	"companyId": { type: String, label: "Id d'entreprise", optional: true, autoform: { omit: true, } },
});
Missions.attachSchema(Globals.schemas.MissionSchema);

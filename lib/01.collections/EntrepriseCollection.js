import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Entreprises = new Mongo.Collection("entreprise");
Entreprises.deny({
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

Globals.schemas.EntrepriseSchema = new SimpleSchema({

	name: {
		type: String,
		label: "Nom de l'entreprise",
		max: 120
	},
	shortDescription: {
		type: String,
		label: "Description (courte)",
		max: 255,
		optional: true
	},
	description: {
		type: String,
		label: "Description",
		max: 2000,
		autoform: {
			afFieldInput: {
				type: "textarea",
				rows: 10
			}
		}
	},
	type: {
		type: String,
		label: "Type d'entreprise",
		allowedValues: ['Public', 'Privé'],
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
	size: {
		type: String,
		label: "Taille d'entreprise",
		allowedValues: Lists.companySizes.ids,
		autoform: {
			type: 'select',
			options: Lists.companySizes.dropDownValues
		}
	},

	field: {
		type: String,
		label: "Domaine professionnel",
		optional: true
	},
	location: {
		type: String,
		label: "Lieu de la entrepriseProfile",
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

	currentState: {
		type: String,
		label: "Etape en cours",
		autoform: {
			omit: true
		},
		optional: true
	},

});
Entreprises.attachSchema(Globals.schemas.EntrepriseSchema);

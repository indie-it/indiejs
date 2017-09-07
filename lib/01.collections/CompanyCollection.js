import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Companies = new Mongo.Collection("company");
Companies.deny({
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

Globals.schemas.CompanySchema = new SimpleSchema({

	name: {
		type: String,
		label: "Nom de l'entreprise",
		max: 120,
		optional: true,
	},
	shortDescription: {
		type: String,
		label: "Description (courte)",
		max: 255,
		optional: true,
	},
	description: {
		type: String,
		label: "Description",
		max: 2000,
		optional: true,
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
		allowedValues: Lists.companyTypes.ids,
		optional: true,
		autoform: {
			type: 'select',
			options: Lists.companyTypes.dropdownValues
		}
	},
	size: {
		type: String,
		label: "Taille d'entreprise",
		allowedValues: Lists.companySizes.ids,
		autoform: {
			type: 'select',
			options: Lists.companySizes.dropdownValues
		},
		optional: true,
	},

	field: {
		type: String,
		label: "Domaine professionnel",
		optional: true,
	},
	location: {
		type: String,
		label: "Ville",
		optional: true,
	},

	createdAt: {
		type: Date,
		label: "Date de création",
		autoValue: function () {
			if (this.isInsert) {
				return new Date;
			} else if (this.isUpsert) {
				return { $setOnInsert: new Date };
			} else {
				this.unset();
			}
		},
		autoform: { omit: true },
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
		},
	},

	userid: {
		type: String,
		label: "Créé par (id)",
		autoform: {
			omit: true
		},
		autoValue: function () {
			if (this.isInsert) {
				return Meteor.userId();
			} else {
				this.unset();
			}
		}
	},

});
Companies.attachSchema(Globals.schemas.CompanySchema);

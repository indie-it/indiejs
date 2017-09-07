import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

FreelanceProfile = new Mongo.Collection('freelanceProfile');

// sécurité renforcée : on va effectuer ces tâches via des méthodes Meteor.
FreelanceProfile.deny({
	insert: function () { return true; },
	update: function () { return true; },
	remove: function () { return true; }
});

// Schéma du profil
Globals.schemas.FreelanceSchema = new SimpleSchema({

    'contact': {
        'type': Globals.schemas.ContactSchema,
        'label': "Informations de contact",
        'optional': true,
    },

    'profile': {
        type: Globals.schemas.FreelanceProfileSchema,
        label: "Profil",
        optional: true,
    },

    'education': {
        'type': Array,
        'label': "Education/Formation",
        optional: true,
    },
    'education.$': {
        'type': Globals.schemas.EducationSchema,
    },

    'experience': {
        type: Array,
        label: "Expérience professionnelle",
        optional: true,
    },
    'experience.$': {
        type: Globals.schemas.ExperienceSchema,
    },

    'skills': {
        'type': Array,
        'label': "Compétences",
        optional: true,
    },
    'skills.$': {
        'type': Globals.schemas.SkillSchema,
		'label': "Niveau de compétence",
    },

    'search': {
        'type': Globals.schemas.FreelanceSearchSchema,
        'label': "Recherche",
        optional: true,
    },

	'photo' : {
		type: Globals.schemas.CloudinaryProfilePicSchema,
		optional: true,
		autoform: { omit: true },
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

});
FreelanceProfile.attachSchema(Globals.schemas.FreelanceSchema);

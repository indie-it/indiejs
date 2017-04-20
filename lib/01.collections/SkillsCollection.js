import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Skills = new Mongo.Collection('skills');

// TODO: sécurité renforcée : on va effectuer ces tâches via des méthodes Meteor.
Skills.deny({
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
Globals.schemas.SkillsSchema = new SimpleSchema({

	name: {
		type: String,
		label: 'Compétence',
	},

});
Skills.attachSchema(Globals.schemas.SkillsSchema);

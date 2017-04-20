import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Skills = new Mongo.Collection('skills');

// TODO: s�curit� renforc�e : on va effectuer ces t�ches via des m�thodes Meteor.
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

// Sch�ma du profil
Globals.schemas.SkillsSchema = new SimpleSchema({

	name: {
		type: String,
		label: 'Comp�tence',
	},

});
Skills.attachSchema(Globals.schemas.SkillsSchema);

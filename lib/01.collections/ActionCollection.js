import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Actions = new Mongo.Collection("actions");
Actions.deny({
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

Globals.schemas.ActionSchema = new SimpleSchema({

	userid: {
		type: String,
		label: "Identifiant utilisateur",
		max: 255
	},

	createdAt: {
		type: Date,
		label: "Date de création",
		autoValue: function () {
			if (this.isInsert) {
				return new Date;
			} else if (this.isUpsert) {
				return {
					$setOnInsert: new Date
				};
			} else {
				this.unset();
			}
		},
		autoform: {
			omit: true
		}
	},

	actionType: {
		type: String,
		allowedValues: Lists.actions.ids
	},

	options: {
		type: Object,
		label: "Options",
		optional: true
	},
	"options.mission": {
		type: String,
		optional: true
	},
	"options.missionid": {
		type: String,
		optional: true
	},
	"options.profile": {
		type: String,
		optional: true
	},
	"options.profileid": {
		type: String,
		optional: true
	},
	"options.username": {
		type: String,
		optional: true
	},
	"options.role": {
		type: String,
		optional: true
	},
	"options.company": {
		type: String,
		optional: true
	},
	"options.companyid": {
		type: String,
		optional: true
	},

});
Actions.attachSchema(Globals.schemas.ActionSchema);

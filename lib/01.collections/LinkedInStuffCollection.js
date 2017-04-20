import SimpleSchema from 'simpl-schema';
//SimpleSchema.extendOptions(['autoform']);

LinkedInStuff = new Mongo.Collection("linkedinstuff");
LinkedInStuff.deny({
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

Globals.schemas.LinkedInStuffSchema = new SimpleSchema({

	//userid: {
	//	type: String
	//},
	state: {
		type: String,
		optional: true
	},
	authorizationCode: {
		type: String,
		optional: true
	},
	accessToken: {
		type: String,
		optional: true
	},
	accessTokenCreationDate: {
		type: Date,
		optional: true
	},
	accessTokenExpiresIn: {
		type: Number,
		optional: true
	},
	accessTokenExpirationDate: {
		type: Date,
		optional: true
	},


});
LinkedInStuff.attachSchema(Globals.schemas.LinkedInStuffSchema);





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

	// _id est directement l'id utilisateur (on ne stocke plus userid dans le champ userid mais directement dans _id)

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

	// on stockera ici les données récupérées via LinkedIn
	linkedinInfo: {
		type: Object,
		optional: true,
	},
	"linkedinInfo.firstName": { type: String, optional: true },
	"linkedinInfo.lastName": { type: String, optional: true },
	"linkedinInfo.title": { type: String, optional: true },
	"linkedinInfo.description": { type: String, optional: true },
	"linkedinInfo.specialties": { type: String, optional: true },
	"linkedinInfo.pictureUrl": { type: String, optional: true },
	"linkedinInfo.emailAddress": { type: String, optional: true },
	"linkedinInfo.industry": { type: String, optional: true },
	"linkedinInfo.numConnections": { type: Number, optional: true },
	"linkedinInfo.location": { type: String, optional: true },

	// dernière expérience récupérée via LinkedIn
	"linkedinInfo.latestExperience": { type: Object, optional: true },
	"linkedinInfo.latestExperience.title": { type: String, optional: true },
	"linkedinInfo.latestExperience.description": { type: String, optional: true },
	"linkedinInfo.latestExperience.start": { type: Date, optional: true },
	"linkedinInfo.latestExperience.end": { type: Date, optional: true },
	"linkedinInfo.latestExperience.isCurrent": { type: Boolean, optional: true },
	"linkedinInfo.latestExperience.company": { type: String, optional: true },


});
LinkedInStuff.attachSchema(Globals.schemas.LinkedInStuffSchema);





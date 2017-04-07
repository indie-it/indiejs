import {
	Meteor
} from 'meteor/meteor'
import SimpleSchema from 'simpl-schema';

Meteor.methods({
	"userprofile.insert": function(insertdoc) {
		console.log("userProfile.insert");

		insertdoc.userid = this.userId;
		insertdoc.createdAt = new Date();

		Globals.schemas.UserProfileSchema.validate(insertdoc);

		return UserProfiles.insert(insertdoc);
	},
	"userprofile.update": function(updatedoc) {
		console.log("userProfile.update");

		var profile = UserProfiles.findOne({
			userid: this.userId
		});

		updatedoc.$set.userid = this.userId;
		updatedoc.$set.createdAt = profile.createdAt;

		Globals.schemas.UserProfileSchema.validate(updatedoc.$set);

		UserProfiles.update(profile._id, updatedoc, function(err) {
			if (err) {
				throw new Meteor.Error(500, error.message);
				return;
			}
			console.log("Update successful!");
		});
		return true;
	},
});

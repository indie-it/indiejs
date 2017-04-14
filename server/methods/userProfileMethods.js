import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema';

Meteor.methods({
	"userprofile.insert": function (insertdoc) {
		console.log("userProfile.insert");

		insertdoc.userid = this.userId;
		insertdoc.createdAt = new Date();

		// force la mise à jour du champ availDate.
		if (insertdoc.isAvailable === true) {
			insertdoc.availDate = new Date();
		}

		// validation de l'objet
		Globals.schemas.UserProfileSchema.validate(insertdoc);

		return UserProfiles.insert(insertdoc, function (err, objectid) {

			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			var profileNameAndTitle = insertdoc.firstName + " " + insertdoc.lastName;
			if (insertdoc.title) {
				profileNameAndTitle += " (" + insertdoc.title + ")";
			}

			Actions.insert({
				actionType: 'profile-create',
				userid: Meteor.userId(),
				options: {
					profile: profileNameAndTitle,
					profileid: objectid,
					username: Meteor.user().username
				}
			}, function (err, objId) {
				if (err) {
					console.error(err);
				}
				console.log("Action enregistrée");
			});
		});
	},
	"userprofile.update": function (updatedoc) {
		console.log("userProfile.update");

		var profile = UserProfiles.findOne({
			userid: this.userId
		});

		updatedoc.$set.userid = this.userId;
		updatedoc.$set.createdAt = profile.createdAt;

		// validation via le schéma défini
		Globals.schemas.UserProfileSchema.validate(updatedoc.$set);

		//// force la mise à jour du champ availDate.
		//if (updatedoc.$set.isAvailable === true) {
		//	updatedoc.$set.availDate = new Date();
		//	console.log("updatedoc.$set.availDate: " + updatedoc.$set.availDate);
		//}


		UserProfiles.update(profile._id, updatedoc, function (err) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			var profileNameAndTitle = profile.firstName + " " + profile.lastName;
			if (profile.title) {
				profileNameAndTitle += " (" + profile.title + ")";
			}

			Actions.insert({
				actionType: 'profile-update',
				userid: Meteor.userId(),
				options: {
					profile: profileNameAndTitle,
					profileid: profile._id,
					username: Meteor.user().username
				}
			}, function (err, objId) {
				if (err) {
					console.error(err);
				}
				console.log("Action enregistrée");
			});

			console.log("Update successful!");
		});
		return true;
	},
});

import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

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
		Globals.schemas.UserProfilesSchema.validate(insertdoc);

		return UserProfiles.insert(insertdoc, function (err, objectid) {

			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			var profileNameAndTitle = insertdoc.firstName + " " + insertdoc.lastName;
			if (insertdoc.title) {
				profileNameAndTitle += " (" + insertdoc.title + ")";
			}

			Actions.insert({
				actionType: Lists.actions.map.profileFreelancerCreate,
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

		// validation via le schéma défini
		Globals.schemas.UserProfilesSchema.validate(updatedoc.$set);

		// mise à jour
		UserProfiles.update(updatedoc._id, updatedoc, function (err) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			var profileNameAndTitle = `${updatedoc.$set.firstName} ${updatedoc.$set.lastName}`;
			if (updatedoc.$set.title) {
				profileNameAndTitle += ` (${updatedoc.$set.title})`;
			}

			Actions.insert({
				actionType: Lists.actions.map.profileFreelancerUpdate,
				userid: Meteor.userId(),
				options: {
					profile: profileNameAndTitle,
					profileid: updatedoc._id,
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
	"userprofile.updateWithId": function (updatedoc, docId) {
		check(docId, String);

		console.log(`userProfile.updateWithId - docId: ${docId}`);

		// validation via le schéma défini
		Globals.schemas.UserProfilesSchema.validate(updatedoc.$set);

		// mise à jour
		UserProfiles.update(docId, updatedoc, function (err) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			var profileNameAndTitle = updatedoc.$set.firstName + " " + updatedoc.$set.lastName;
			if (updatedoc.$set.title) {
				profileNameAndTitle += " (" + updatedoc.$set.title + ")";
			}

			Actions.insert({
				actionType: Lists.actions.map.profileFreelancerUpdate,
				userid: Meteor.userId(),
				options: {
					profile: profileNameAndTitle,
					profileid: updatedoc._id,
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

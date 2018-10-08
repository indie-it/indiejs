/*import { Meteor } from 'meteor/meteor';*/
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

Meteor.methods({

	"userprofile.insert": (insertdoc) => {
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
			console.log("Update successful!");
		});
		return true;
	},
	"userprofile.updateWithId": (updatedoc, docId) => {
		check(docId, String);

		console.log(`userProfile.updateWithId - docId: ${docId}`);

		// validation via le schéma défini
		Globals.schemas.UserProfilesSchema.validate(updatedoc.$set);

		// mise à jour
		UserProfiles.update(docId, updatedoc, function (err) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}
			console.log("Update successful!");
		});
		return true;
	},
	"changeUserProfile": (userid, newrole) => {

		// 0. vérifs
		check(userid, String);
		check(newrole, String);

		// 1. vérif du nouveau rôle
		let index = _.indexOf(Lists.roles.ids, newrole);
		if (index == -1) {
			console.error("Rôle introuvable.");
			return false;
		}

		// 2. récup de l'utilisateur
		let user = Meteor.users.findOne(userid);
		if(!user) {
			console.error("Utilisateur introuvable.");
			return false;
		}

		// 3. vérification du rôle de l'utilisateur
		let test = Roles.userIsInRole(userid, newrole);
		if (test === true) {
			console.error("L'utilisateur a déjà ce rôle.");
			return false;
		}

		// 4. affectation du nouveau rôle.
		Roles.addUsersToRoles(userid, [newrole]);
		return true;
	},

});

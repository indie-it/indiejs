import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import { publishComposite } from 'meteor/reywood:publish-composite';

Meteor.publish("user.getByFreelanceProfileId", function (userProfileId) {
	console.log(`[user.getByFreelanceProfileId] - userProfileId: ${userProfileId}`);

	// We need to check the `listId` is the type we expect
	check(userProfileId, String);

	var profile = FreelanceProfile.findOne({ _id: userProfileId });
	if (!profile) {
		throw new Meteor.Error(500, "Profil non trouvé");
	}

	return Meteor.users.find(profile.userid, { fields: { emails: 1 } });
});

Meteor.publishComposite("tabular_UserAndFreelanceProfiles", function (tableName, ids, fields) {

	// vérifs
	check(tableName, String);
	check(ids, Array);
	check(fields, Match.Optional(Object));

	this.unblock(); // requires meteorhacks:unblock package

	console.log(`tabular_UserAndFreelanceProfiles(${tableName}, ids, fields)`);
	/*console.log(`tabular_UserAndFreelanceProfiles(${tableName}, ${ids}, ${fields})`);*/
	/*console.log(fields);*/


	return {
		find: function () {
			this.unblock(); // requires meteorhacks:unblock package

			// check for admin role with alanning:roles package
			if (!Roles.userIsInRole(this.userId, 'admin')) {
				return [];
			}


			return Meteor.users.find(
				{ '_id': { '$in': ids } },
				{ 'fields': fields }
			);

			/*// récupération des ids de tous les freelances.
			let filteredids = Roles.getUsersInRole('freelancer').map((doc, index, cursor) => { return doc._id; });

			// filtrage de la liste sur les ids à afficher:
			let newids = _.intersection(ids, filteredids);

			// on renvoie les utilisateurs qui correspondent
			return Meteor.users.find(
				{ '_id': { '$in': newids } },
				{ 'fields': fields, 'sort': { _id: 1 } }
			);*/
		},
		children: [{
			find: function(user) {
				this.unblock(); // requires meteorhacks:unblock package

				// Publish the related profile
				/*return FreelanceProfile.find({ 'userid': user._id }, { limit: 1, fields: { contact: 1 } });*/
				return FreelanceProfile.find({ 'userid': user._id });
			}
		}]
	};
});

//tabular_UserAndCompanyProfiles
Meteor.publishComposite("tabular_UserAndCompanyProfiles", function (tableName, ids, fields) {

	// vérifs
	check(tableName, String);
	check(ids, Array);
	check(fields, Match.Optional(Object));

	this.unblock(); // requires meteorhacks:unblock package

	console.log(`tabular_UserAndCompanyProfiles(${tableName}, ids, fields)`);

	return {
		find: function () {
			this.unblock(); // requires meteorhacks:unblock package

			// check for admin role with alanning:roles package
			if (!Roles.userIsInRole(this.userId, 'admin')) {
				return [];
			}


			return Meteor.users.find(
				{ '_id': { '$in': ids } },
				{ 'fields': fields }
			);

		},
		children: [{
			find: function(user) {
				this.unblock(); // requires meteorhacks:unblock package

				// Publish the related profile
				return Companies.find({ 'userid': user._id });
			}
		}]
	};
});

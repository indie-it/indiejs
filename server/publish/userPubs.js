import { check } from 'meteor/check';

Meteor.publish("user.getByFreelanceProfileId", function (userProfileId) {
	console.log(`[user.getByFreelanceProfileId] - userProfileId: ${userProfileId}`);

	// We need to check the `listId` is the type we expect
	check(userProfileId, String);

	var profile = FreelanceProfile.findOne({ _id: userProfileId });
	if (!profile) {
		throw new Meteor.Error(500, "Profil non trouvé");
	}

	return Meteor.users.find(profile.userid, {
		fields: {
			emails: 1
		}
	});
});

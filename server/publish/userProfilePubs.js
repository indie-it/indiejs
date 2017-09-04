import { check } from 'meteor/check';

Meteor.publish('userprofile.getTabular', function () {

	console.log("userprofile.getTabular");

	return UserProfiles.find({});

});
Meteor.publish("userprofile.getById", function (userProfileId) {

	console.log(`userprofile.getById - userProfileId: ${userProfileId}`);

	// We need to check the `listId` is the type we expect
	check(userProfileId, String);

	// on renvoie un cursor ou un array via find ou find().fetch()
	// mais jamais l'objet directement (findOne ne marchera pas).
	return UserProfiles.find({ _id: userProfileId });

});
Meteor.publish("userprofile.getByUserId", function (userid) {

	console.log(`userprofile.getByUserId - userid: ${userid}`);

	// We need to check the `listId` is the type we expect
	check(userid, String);

	// on renvoie un cursor ou un array via find ou find().fetch()
	// mais jamais l'objet directement (findOne ne marchera pas).
	return UserProfiles.find({ userid: userid });

});
Meteor.publish("userprofile.get", function () {

	console.log("userprofile.get");

	//if (!this.userId) {
	//	this.stop();
	//	return;
	//}

	// on renvoie un cursor ou un array via find ou find().fetch()
	// mais jamais l'objet directement (findOne ne marchera pas).
	return UserProfiles.find({ userid: this.userId });
});
Meteor.publish('userprofile.getCount', function () {

	console.log("userprofile.getCount");

	return UserProfiles.find({}, { fields: { id: 1, firstName: 1, lastName: 1 } });

});

Meteor.publish("user.getById", function (userProfileId) {

	console.log(`user.getById - userProfileId: ${userProfileId}`);

	// We need to check the `listId` is the type we expect
	check(userProfileId, String);

	var profile = UserProfiles.findOne({ _id: userProfileId });
	if (!profile) {
		throw new Meteor.Error(500, "Profil non trouv�");
	}

	return Meteor.users.find(profile.userid, {
		fields: {
			emails: 1
		}
	});

});

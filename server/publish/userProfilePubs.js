import SimpleSchema from 'simpl-schema';

// Publications liées aux profils utilisateurs.
// TOUJOURS EXECUTE COTE SERVEUR !

Meteor.publish('userprofile.getHeaders', function () {
	console.log("[userProfilePublications.js] userprofile.getHeaders");
	return UserProfiles.find({
		// isAvailable: true
	}, {
			fields: {
				title: 1,
				updated: 1,
				isAvailable: 1,
				availDate: 1
			},
			//sort: {
			//	//isAvailable: -1,
			//	availDate: 1,
			//	updated: 1
			//},
		});
});
Meteor.publish("userprofile.getById", function (userProfileId) {
	console.log("[userProfilePublications.js] userprofile.getById - userProfileId = " + userProfileId);
	// We need to check the `listId` is the type we expect
	new SimpleSchema({ userProfileId: { type: String } })
		.validate({ userProfileId });

	// on renvoie un cursor ou un array via find ou find().fetch()
	// mais jamais l'objet directement (findOne ne marchera pas).
	return UserProfiles.find({ _id: userProfileId });
});
Meteor.publish("userprofile.getByUserId", function (userid) {
	console.log("[userProfilePublications.js] userprofile.getByUserId - userid = " + userid);
	// We need to check the `listId` is the type we expect
	new SimpleSchema({ userid: { type: String } })
		.validate({ userid });

	// on renvoie un cursor ou un array via find ou find().fetch()
	// mais jamais l'objet directement (findOne ne marchera pas).
	return UserProfiles.find({ userid: userid });
});
Meteor.publish("userprofile.get", function () {
	console.log("userprofile.get");

	if (!this.userId) {
		this.stop();
		return;
	}

	// on renvoie un cursor ou un array via find ou find().fetch()
	// mais jamais l'objet directement (findOne ne marchera pas).
	return UserProfiles.find({ userid: this.userId });
});

import SimpleSchema from 'simpl-schema';


//Meteor.publish('missions', function() {
//	return Missions.find();
//});

Meteor.publish('allMissions', function () {
	console.log("Meteor.publish('allMissions', ... )");
	return Missions.find({});
});

Meteor.publish('missions.headers', function () {
	console.log("Meteor.publish('missions.headers', ... )");
	return Missions.find({
		notinterestedUserIds: { $ne: this.userId }
	}, {
		fields: {
			description: 0,
			author: 0
		},
		sort: {
			createdAt: 1
		}
	});
});

Meteor.publish("missionById", function (missionId) {
	// We need to check the `listId` is the type we expect
	new SimpleSchema({
		missionId: {
			type: String
		}
	}).validate({
		missionId
	});

	return Missions.find({
		_id: missionId
	});
});

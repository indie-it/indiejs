import SimpleSchema from 'simpl-schema';


Meteor.publish('missions', function() {
	return Missions.find();
});

Meteor.publish('allMissions', function() {
	console.log("Meteor.publish('allMissions', ... )");
	return Missions.find({});
});

Meteor.publish('allMissionsHeader', function() {
	console.log("Meteor.publish('allMissionsHeader', ... )");
	return Missions.find({}, {
		fields: {
			description: 0,
			author: 0
		},
		sort: {
			createdAt: 1
		}
	});
});

Meteor.publish("missionById", function(missionId) {
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

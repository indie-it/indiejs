import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

Meteor.publish('missions.headers', function () {
	console.log("missions.headers");
	return Missions.find({

		// on ne récupère que les missions dont l'état = 'active'
		"currentState.step": Lists.missionWorkflow.map.STEP_VALIDATED,

		// on retire les missions qui n'intéressent pas l'utilisateur courant.
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

Meteor.publish('missions.headersAdmin', function () {
	return Missions.find({}, { fields: { description: 0, author: 0 }, sort: { updated: -1, createdAt: -1 } });
});

Meteor.publish("mission.getById", function (missionId) {
	// We need to check the `listId` is the type we expect
	check(missionId, String);

	return Missions.find({ _id: missionId });
});

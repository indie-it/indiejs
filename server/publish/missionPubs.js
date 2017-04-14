import SimpleSchema from 'simpl-schema';

Meteor.publish('missions.headers', function () {
	console.log("Meteor.publish('missions.headers', ... )");
	return Missions.find({

		// on ne récupère que les missions dont l'état = 'active'
		currentState: WorkflowConst.STEP_VALIDATED,

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
Meteor.publish("mission.getById", function (missionId) {
	// We need to check the `listId` is the type we expect
	new SimpleSchema({ missionId: { type: String } }).validate({ missionId });

	return Missions.find({ _id: missionId });
});


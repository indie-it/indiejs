import SimpleSchema from 'simpl-schema';

Meteor.publish('actions.missions.sortedByDateDesc', function () {
	//if (!this.userId) {
	//	return;
	//}
	console.log("[actions.missions.sortedByDateDesc]");
	return Actions.find({
		$or: [
			{ actionType: 'mission-create' },
			{ actionType: 'mission-update' },
			//{ actionType: 'user-interested' }
		]
	}, { sort: { createdAt: -1 }, limit: 15 });
});

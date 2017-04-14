import SimpleSchema from 'simpl-schema';

Meteor.publish('actions.missions.sortedByDateDesc', function () {

	if (!this.userId) {
		this.stop();
		return;
	}

	console.log("[actions.missions.sortedByDateDesc]");

	var isadmin = Roles.userIsInRole(this.userId, 'admin');

	//console.log("isadmin: " + isadmin);


	if (isadmin) {
		return Actions.find({}, { sort: { createdAt: -1 }, limit: 15 });
	}

	return Actions.find({
		$or: [
			//{ actionType: 'mission-create' },
			{ actionType: 'mission-update' },
			//{ actionType: 'user-interested' }
		]
	}, { sort: { createdAt: -1 }, limit: 15 });
});

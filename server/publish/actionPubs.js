import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

Meteor.publish('actions.missions.sortedByDateDesc', function () {

	if (!this.userId) {
		this.stop();
		return;
	}

	console.log("[actions.missions.sortedByDateDesc]");

	var isadmin = Roles.userIsInRole(this.userId, 'admin');
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

Meteor.publish('actions.missions.getWithMissionId', function (missionid, desc) {

	//if (!this.userId) {
	//	this.stop();
	//	return;
	//}

	check(missionid, String);

	var sortDesc = !!desc;
	var sortOrder = (sortDesc === true) ? 1 : -1;
	console.log(`sortOrder: ${sortOrder}`);

	console.log("actions.missions.getWithMissionId");

	//return Actions.find({ "options.missionid": missionid }, { sort: { createdAt: sortOrder }, limit: 15 });
	return Actions.find({ "options.missionid": missionid }, { sort: { createdAt: sortOrder } });
});


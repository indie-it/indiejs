import SimpleSchema from 'simpl-schema';

Meteor.publish('actions.all.sortedByDateDesc', function () {
	//if (!this.userId) {
	//	return;
	//}
	console.log("[actions.all.sortedByDateDesc]");
	return Actions.find({}, {
		sort: { createdAt: -1 },
		limit: 15
	});
});

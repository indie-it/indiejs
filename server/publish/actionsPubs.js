import SimpleSchema from 'simpl-schema';

Meteor.publish('actions.all.sortedByDateDesc', function () {
	console.log("[actions.all.sortedByDateDesc]");
	return Actions.find({},
		{
			sort: {
				createdAt: -1
			}
		});
});

import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

Meteor.publish('notifications.getForCurrentUser', function () {
	console.log(`[notifications.getForCurrentUser] - user: ${this.userId}`);

	// if (!this.userId) {
    //     console.log("stopping - this.userId not set");
	// 	this.stop();
	// 	return null;
	// }

	return Notifications.find({
		userid: this.userId,
	}, {
		'sort': { date: -1 },
		'limit': 10,
	});
});

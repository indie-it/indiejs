import { check } from 'meteor/check';

Meteor.publish('tos.getForCurrentUser', function () {
    console.log(`[tos.getForCurrentUser] this.userId: ${ this.userId }`);
	return Tos.find({ userid: this.userId });
});

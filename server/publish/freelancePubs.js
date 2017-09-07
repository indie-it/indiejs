import { check } from 'meteor/check';

Meteor.publish('freelance.getById', function (id) {
	console.log(`[freelance.getByUserId] id: ${id}`);
	check(id, String);
	return FreelanceProfile.find(id);
});
Meteor.publish('freelance.getByUserId', function (userid) {
	console.log(`[freelance.getByUserId] userid: ${userid}`);
	check(userid, String);
	return FreelanceProfile.find({ 'userid': userid });
});
Meteor.publish('freelance.getTabular', function () {
	console.log(`[freelance.getTabular]`);
	return FreelanceProfile.find({}); //, { fields: { userid: 1, profile: 1, updated: 1, contact: 1, skills: 1, } });
});

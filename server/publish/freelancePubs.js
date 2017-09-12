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
Meteor.publish('freelance.getTabular', function (tableName, ids, fields) {

	console.log(`[freelance.getTabular]`);

	check(tableName, String);
    check(ids, Array);

	console.log(tableName);
	console.log(ids);
	console.log(fields);

	return FreelanceProfile.find({}); //, { fields: { userid: 1, profile: 1, updated: 1, contact: 1, skills: 1, } });
});
Meteor.publish("freelance.get", function () {
	console.log("[freelance.get]");
	// on renvoie un cursor ou un array via find ou find().fetch()
	// mais jamais l'objet directement (findOne ne marchera pas).
	return FreelanceProfile.find({ userid: this.userId });
});
Meteor.publish('freelance.getCount', function () {
	console.log("[freelance.getCount]");
	return FreelanceProfile.find({}, { fields: { id: 1, contact: 1 } });
});

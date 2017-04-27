//import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

Meteor.publish('company.getHeaders', function () {
	return Companies.find({}, {
		fields: {
			name: 1,
			field: 1,
			updated: 1,
		},
		sort: {
			name: 1
		},
	});
});

Meteor.publish("company.getById", function (companyid) {
	check(companyid, String);
	return Companies.find(companyid);
});

Meteor.publish("company.getByUserId", function (userid) {
	check(userid, String);
	return Companies.find({ userid: userid });
});

Meteor.publish("company.get", function () {
	console.log("company.get - this.userid: " + this.userId);

	if (!this.userId) {
		this.stop();
		return;
	}

	return Companies.find({ userid: this.userId });
});

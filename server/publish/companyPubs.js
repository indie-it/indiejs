//import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

Meteor.publish('company.getHeaders', function () {
	var selectorObj = {};

	// restrictions sur les recruteurs: ils ne peuvent pas voir les autres entreprises.
	var isRecruiter = Roles.userIsInRole(this.userId, Globals.roles.recruiter);

	console.log(`company.getHeaders - isRecruiter: ${isRecruiter}`);

	if (isRecruiter === true) {
		selectedObj.userid = this.userId;
	}

	return Companies.find(selectorObj, {
		fields: { name: 1, field: 1, updated: 1, },
		sort: { name: 1 },
	});
});

Meteor.publish("company.getById", function (companyid) {
	check(companyid, String);

	// TODO: restrictions sur les recruteurs: ils ne peuvent pas voir les autres entreprises

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

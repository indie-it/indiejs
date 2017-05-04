import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
	"company.insert": function (insertdoc) {
		console.log("company.insert");

		insertdoc.userid = this.userId;
		insertdoc.createdAt = new Date();

		Globals.schemas.CompanySchema.clean(insertdoc);
		Globals.schemas.CompanySchema.validate(insertdoc);

		return Companies.insert(insertdoc, function (err, objectid) {

			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			var companyNameAndField = insertdoc.name;
			if (insertdoc.field) {
				companyNameAndField += ` (${insertdoc.field})`;
			}

			Actions.insert({
				actionType: Lists.actions.map.profileRecruiterCreate,
				userid: Meteor.userId(),
				options: {
					company: companyNameAndField,
					companyid: objectid,
					username: Meteor.user().username
				}
			}, function (err, objId) {
				if (err) {
					console.error(err);
				}
				console.log("Action enregistrée");
			});
		});
	},
	"company.update": function (docid, updatedoc) {
		console.log("company.update");

		check(docid, String);

		Companies.update(docid, updatedoc, function (err) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			var companyNameAndField = updatedoc.$set.name;
			if (updatedoc.$set.field) {
				companyNameAndField += ` (${updatedoc.$set.field})`;
			}

			Actions.insert({
				actionType: Lists.actions.map.profileRecruiterUpdate,
				userid: Meteor.userId(),
				options: {
					company: companyNameAndField,
					companyid: docid,
					username: Meteor.user().username
				}
			}, function (err, objId) {
				if (err) {
					console.error(err);
				}
				console.log("Action enregistrée");
			});

			console.log("Update successful!");

		});

		return true;
	},
});
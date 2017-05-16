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

			console.log("Insert successful!");
		});
	},
	"company.update": function (docid, updatedoc) {
		console.log("company.update");

		check(docid, String);

		Companies.update(docid, updatedoc, function (err) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			console.log("Update successful!");

		});

		return true;
	},
});
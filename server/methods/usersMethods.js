import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
	"user.insert": function (user) {
		return Accounts.createUser(user);
	},
});



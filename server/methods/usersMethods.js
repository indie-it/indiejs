import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
	"user.insert": function (user) {

		console.log("user.insert");
		console.log(user);

		// validation du document envoyé par le client
		//Globals.schemas.UserSchema.validate(user);

		return Accounts.createUser(user);
	},
});

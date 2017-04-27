// Création des utilisateurs (freelances et entreprises).

import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
	"user.insert": function (user) {
		return Accounts.createUser(user);
	},
});

Meteor.methods({
	"companyAccount.insert": function (user) {

		console.log("companyAccount.insert");

		// création du compte utilisateur
		var account = Accounts.createUser(user);

		// ajout du rôle recruteur (entreprise).
		Roles.addUsersToRoles(account, Globals.roles.recruiter);

		Actions.insert({
			actionType: Lists.actions.map.userCreate,
			userid: account,
			options: {
				username: user.username,
				role: Globals.roles.recruiter,
			}
		});
		
	},
});


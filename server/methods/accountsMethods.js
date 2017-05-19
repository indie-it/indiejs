// Création des utilisateurs (freelances et entreprises).

import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
	"freelancerAccount.insert": function (user) {
		console.log("freelancerAccount.insert");

		// création du compte utilisateur
		var account = Accounts.createUser({
			email: user.email,
			password: user.password,
			username: user.username,
			profile: {
				type: Lists.roles.map.freelancer
			}
		});

		// ajout du rôle recruteur (entreprise).
		Roles.addUsersToRoles(account, Lists.roles.map.freelancer);

		return true;
	},
	"companyAccount.insert": function (user) {

		console.log("companyAccount.insert");

		user.profile.type = Lists.roles.map.recruiter;

		// création du compte utilisateur
		var account = Accounts.createUser(user);

		// ajout du rôle recruteur (entreprise).
		Roles.addUsersToRoles(account, Globals.roles.recruiter);

		return true;

	},
});


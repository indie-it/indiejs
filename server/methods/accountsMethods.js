// Création des utilisateurs (freelances et entreprises).

import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
	"freelancerAccount.insert": function (user) {
		console.log("freelancerAccount.insert");
		console.log(user);

		// création du compte utilisateur
		var account = Accounts.createUser({
			email: user.email,
			password: user.password,
			username: user.username,
		});

		console.log(account);

		// ajout du rôle recruteur (entreprise).
		Roles.addUsersToRoles(account, Globals.roles.freelancer);

		// Journalisation de l'action
		Actions.insert({
			actionType: Lists.actions.map.userCreate,
			userid: account,
			options: {
				username: user.username,
				role: Globals.roles.recruiter,
			}
		});

		return true;
	},
	"companyAccount.insert": function (user) {

		console.log("companyAccount.insert");

		// création du compte utilisateur
		var account = Accounts.createUser(user);

		// ajout du rôle recruteur (entreprise).
		Roles.addUsersToRoles(account, Globals.roles.recruiter);

		// Journalisation de l'action
		Actions.insert({
			actionType: Lists.actions.map.userCreate,
			userid: account,
			options: {
				username: user.username,
				role: Globals.roles.recruiter,
			}
		});

		return true;

	},
});


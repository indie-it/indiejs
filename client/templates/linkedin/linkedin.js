﻿import LinkedIn from 'node-linkedin';
import { Random } from 'meteor/random';

Template.linkedin.helpers({
	"getLinkedInUri": function () {
		return `https://www.linkedin.com/oauth/v2/authorization`
			+ `?response_type=code&client_id=${Globals.linkedin.clientId}&redirect_uri=${Globals.linkedin.redirectUri}&state=${this.state}`;
	},
});
Template.linkedin.events({

	'click #btn-linkedin-authorize': function (event) {
		Meteor.call("user.linkedin.setState", this.state, function (err, res) {
			if (err) {
				sAlert.error(err.Message);
				return;
			}
		});
	},

	'click #btn-linkedin-profile-info': function (event) {
		event.preventDefault();

		Meteor.call("user.linkedin.getProfileInfo", this.state, function (err, res) {

			if (err) {
				sAlert.error(err.Message);
				return;
			}

			if (res) {
				console.log(res);

				sAlert.success('Informations du profil récupérées depuis LinkedIn', { onRouteClose: false });
				Router.go(Utils.pathFor('linkedin'));
			}
		});

	},

	'click #btn-import-linkedin-profile': function (event) {
		event.preventDefault();

		Meteor.call("user.linkedin.setProfileInfo", this.state, function (err, res) {

			if (err) {
				sAlert.error(err.Message);
				return;
			}

			if (res) {
				console.log(res);
				sAlert.success('Informations du profil récupérées depuis LinkedIn', { onRouteClose: false });
				Router.go(Utils.pathFor('home'));
			}
		});

	},
});

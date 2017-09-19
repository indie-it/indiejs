import { check } from 'meteor/check';

Router.route('/register', {
	name: "user.register",
	template: "register",
});

Router.route('/company/register', {
	name: "company.register",
	template: "companyRegister",
});

Router.route('/login', {
	name: "login",
	template: "login",
});

Router.route('/email-verify/:_token', {
	name: "emailVerify",
	template: "emailVerify",
	data: function () {
		if (!this.ready() || !Meteor.user()) { return; }

		check(this.params._token, String);

		console.log(`emailVerify ${this.params._token}`);

		var email = Meteor.user().emails[0];
		if (email.verified == true) {
			sAlert.success("Votre adresse e-mail a déjà été vérifiée.", { onRouteClose: false });
			$('#success').text("Votre adresse e-mail a déjà été vérifiée.");
			return;
		}

		Accounts.verifyEmail(this.params._token, function (err) {

			if (err) {
				sAlert.error(err.message);
				$('#error').text(err.message);
				return;
			}

			sAlert.success("Votre adresse e-mail a bien été vérifiée.", { onRouteClose: false });
			Router.go(Utils.pathFor('home'));
		});
	},
});

Router.route('/password-reset', {
	name: "passwordReset",
	template: "passwordReset",
});
Router.route('/password-recover/:_token', {
	name: "passwordRecover",
	template: "passwordRecover",
	data: function () {
		return {
			'token': this.params._token
		};
	},
});

Router.route('/logout', {
	name: "user.logout",
	template: "logout",
});

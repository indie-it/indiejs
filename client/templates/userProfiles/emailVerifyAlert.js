Template.emailVerifyAlert.events({

	'click a': function (event, tpl) {
		if (Meteor.userId()) {
			Meteor.call("email.verify", function (err) {
				if (err) {
					sAlert.error(err.message);
					return;
				}

				sAlert.success("Un e-mail va être envoyé à votre adresse. Cliquez sur le lien pour terminer la vérification.", { onRouteClose: false });
				Router.go(Utils.pathFor('home'));
			});
		}
	},

});

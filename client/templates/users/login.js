Template.login.events({
	'submit form': function (event, template) {
		event.preventDefault();

		var user = $('#username').val();
		var password = $('#password').val();

		if (!user || !password) {
			sAlert.error("Veuillez renseigner votre nom d'utilisateur et votre mot de passe.");
			return;
		}

		Meteor.loginWithPassword(user, password, function (err) {
			if (err) {
				sAlert.error(err.reason);
				return;
			}
			sAlert.success("Vous êtes connecté");
		});
	}
});

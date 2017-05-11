import SimpleSchema from 'simpl-schema';

Template.passwordRecover.events({

	'submit form': function (event, tpl) {

		event.preventDefault();

		console.log("Template.passwordRecover.events");

		var pwd = $("#password").val();
		var confirmation = $("#password-confirm").val();
		if (!pwd) {
			sAlert.error("Merci de renseigner le mot de passe.");
			return false;
		}

		if (pwd !== confirmation) {
			sAlert.error("Les mots de passe ne correspondent pas.");
			return false;
		}

		console.log(tpl);

		Accounts.resetPassword(tpl.data.token, pwd, function (err) {
			if (err) {
				sAlert.error(err.message);
				return;
			}
			sAlert.success("Votre mot de passe a bien été mis à jour", { onRouteClose: false });
			Router.go(Utils.pathFor('home'));
		});

	},

});

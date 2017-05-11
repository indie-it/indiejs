import SimpleSchema from 'simpl-schema';

Template.passwordReset.events({

	'submit form': function (event, template) {
		event.preventDefault();
		try {

			var email = $('#email').val();

			// vérifier la validité de la saisie: est-ce bien une adresse e-mail?
			new SimpleSchema({ 'email': { type: String, regEx: SimpleSchema.RegEx.Email, } }).validate({ email });

			if (!email) {
				sAlert.error("Veuillez renseigner votre adresse e-mail.");
				return;
			}

			// envoi du lien par e-mail avec token
			Accounts.forgotPassword({ 'email': email }, function (err) {
				if (err) {
					sAlert.error(err.reason);
					return;
				}
				sAlert.success("Un e-mail de remise à zéro de votre mot de passe vient de vous être envoyé.");
			});

		} catch (err) {
			sAlert.error(err.message);
		}
	},

});

AutoForm.hooks({
	'insertUser': {

		onSubmit: function (doc) { // Gestion du formulaire d'inscription

			//console.log(doc);
			const tosChecked = $('#checkTos').is(':checked');

			if (!doc.username || !doc.password || !doc.email) {
				sAlert.error("Veuillez renseigner les champs obligatoires.");
				return false;
			}

			if (!tosChecked) {
				sAlert.error("Veuillez accepter les CGU du site.");
				return false;
			}
			
			var self = this;

			var options = {
				username: doc.username,
				email: doc.email.address,
				password: doc.password,
			};

			Meteor.call('freelancerAccount.insert', options, function (err) {
				console.log(err);
				if (!err) {
					self.done(); // Appelle onSuccess
					return;
				}

				self.done(err); // Appelle onError

			});

			return false; // Dans tous les cas, arrête la soumission des donneés.
		},

		onSuccess: function () {
			sAlert.success("Le nouvel utilisateur a bien été créé. Vous pouvez à présent vous connecter.", { onRouteClose: false });
			Router.go(Utils.pathFor('home'));
		},

		onError: function (formType, err) {
			console.log(err);
			sAlert.error(err.message);
		}

	}
});

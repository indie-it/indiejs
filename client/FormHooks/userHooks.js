AutoForm.hooks({
	'insertUser': {

		onSubmit: function (doc) { // Gestion du formulaire d'inscription

			console.log(doc);

			if (!doc.username || !doc.password || !doc.emails) {
				sAlert.error("Veuillez renseigner les champs obligatoires.");
				return false;
			}
			var email = doc.emails[0].address;

			var self = this;

			Accounts.createUser({
				username: doc.username,
				email: email,
				password: doc.password,
				profile: doc.profile ? doc.profile : {}
			}, function (err) {
				console.log(err);
				if (!err) {
					self.done(); // Appelle onSuccess
				}
				else {
					self.done(error); // Appelle onError
				}
			});

			return false; // Dans tous les cas, arrête la soumission des donneés.
		},

		onSuccess: function () {
			sAlert.success("Utilisateur créé!");
			Router.go(Utils.pathFor('home'));
		},

		onError: function (formType, err) {
			console.log(err);
			sAlert.error(err.message);
		}

	}
});

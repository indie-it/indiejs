AutoForm.hooks({
	'insertCompanyAccount': {

		onSubmit: function (doc) {

			console.log(doc);

			if (!doc.username || !doc.password || !doc.email) {
				sAlert.error("Veuillez renseigner les champs obligatoires.");
				return false;
			}
			var email = doc.email.address;

			var self = this;

			const newdoc = {
				username: doc.username,
				email: email,
				password: doc.password,
				profile: doc.profile ? doc.profile : {},
			};

			Meteor.call('companyAccount.insert', newdoc, function (err, res) {
				console.log(err);
				if (!err) {
					self.done(); // Appelle onSuccess
				}
				else {
					self.done(err); // Appelle onError
				}
			});

			return false; // Dans tous les cas, arrête la soumission des donneés.
		},

		onSuccess: function () {
			sAlert.success("Votre compte a bien été créé. Vous pouvez vous connecter dès maintenant.", { onRouteClose: false });
			Router.go(Utils.pathFor('home'));
		},

		onError: function (formType, err) {
			console.log(err);
			sAlert.error(err.message);
		}

	},
	'company.createorupdate': {
		onSubmit: function (insertdoc, updatedoc, currentdoc) {
			console.log("company.createorupdate");
			console.log(currentdoc);

			var self = this;

			var update = function () {
				console.log("calling company.update");
				Meteor.call("company.update", currentdoc._id, updatedoc, function (err, result) {
					if (err) {
						console.log("error", err);
						self.done(err); // Appelle onError
						return;
					}
					self.done(); // Appelle onSuccess

				});
			}; 
			var insert = function () {
				console.log("calling company.insert");
				Meteor.call("company.insert", insertdoc, function (err, result) {
					if (err) {
						console.log("error", err);
						self.done(err); // Appelle onError
						return;
					}
					self.done(); // Appelle onSuccess
				});
			}; 

			if (!currentdoc) {
				Globals.schemas.CompanySchema.clean(insertdoc);
				insert();
			} else {
				update();
			}

			return false;
		},

		onSuccess: function () {
			sAlert.success("Modifications enregistrées", { onRouteClose: false });
			Router.go(Utils.pathFor('home'));
		},

		onError: function (formType, err) {
			console.log(err);
			sAlert.error(err.message);
		}

	},

});

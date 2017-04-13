AutoForm.hooks({

	'userprofile.createorupdate': {
		onSubmit: function (insertdoc, updatedoc, currentdoc) {
			var self = this;
			if (!currentdoc) {
				// création de profil
				Meteor.call("userprofile.insert", insertdoc, function (err, result) {
					if (err) {
						console.log("error", err);
						self.done(err); // Appelle onError
						return;
					}
					self.done(); // Appelle onSuccess
				});
				return false;
			}

			// Mise à jour de profil
			Meteor.call("userprofile.update", updatedoc, function (error) {
				if (error) {
					console.log("error", error);
					self.done(error); // Appelle onError
					return;
				}
				self.done(); // Appelle onSuccess
			});
			return false;
		},
		onSuccess: function () {
			sAlert.success("Modifications sauvegardées", { onRouteClose: false });
			Router.go(Utils.pathFor('home'));
		},
		onError: function (formType, err) {
			var error = err.reason ? err.reason : err;
			sAlert.error('Erreur! ' + error);
		}
	}
});

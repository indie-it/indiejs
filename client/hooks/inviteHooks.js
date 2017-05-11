AutoForm.hooks({

	"createInvite": {

		onSubmit: function (doc) {

			console.log(doc);

			if (!doc.firstName || !doc.lastName || !doc.email) {
				sAlert.error("Veuillez renseigner les champs obligatoires.");
				return false;
			}

			Globals.schemas.InvitationSchema.clean(doc);

			var self = this;

			Meteor.call('invite.send', doc, function (err, res) {
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
			sAlert.success("Votre invitation a été enregistrée. Elle sera envoyée d'ici peu.", { onRouteClose: false });
			Router.go(Utils.pathFor('home'));
		},

		onError: function (formType, err) {
			console.log(err);
			sAlert.error(err.message);
		}
	},

});
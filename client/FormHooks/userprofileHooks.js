AutoForm.hooks({

	'userprofile.create': {
		// Called when form does not have a `type` attribute
		onSubmit: function(doc) {
			var self = this;
			Meteor.call("userprofile.insert", doc, function(error, result) {
				if (error) {
					console.log("error", error);
					self.done(error); // Appelle onError
					return;
				}
				if (result) {
					self.done(); // Appelle onSuccess
				}
			});
			return false;
		},
		// Called when any submit operation succeeds
		onSuccess: function() {
			sAlert.success('Le profil a bien été créé!', {
				onRouteClose: false
			});
			Router.go(Utils.pathFor('home'));
		},
		// Called when any submit operation fails
		onError: function(formType, err) {
			var error = err.reason ? err.reason : err;
			sAlert.error('Erreur! ' + error);
		},
	},

	'userprofile.update': {
		onSubmit: function(insertdoc, updatedoc, currentdoc) {
			var self = this;
			Meteor.call("userprofile.update", updatedoc, function(error) {
				if (error) {
					console.log("error", error);
					self.done(error); // Appelle onError
					return;
				}
				self.done(); // Appelle onSuccess
			});
			return false;
		},
		onSuccess: function() {
			sAlert.success('Le profil a bien été mis à jour!', { onRouteClose: false });
		},
		onError: function(formType, err) {
			var error = err.reason ? err.reason : err;
			sAlert.error('Erreur! ' + error);
		}
	}
});

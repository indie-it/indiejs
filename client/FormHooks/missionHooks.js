AutoForm.hooks({
	'insertMissionForm': {

		// Called when form does not have a `type` attribute
		onSubmit: function(doc) {
			console.log("onSubmit called! ");
			console.log(doc);

			var self = this;
			Meteor.call("mission.insert", doc, function(error, result) {
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
			console.log("onSuccess called!");
			sAlert.success('La mission a bien été créée!', { onRouteClose: false });
			Router.go(Utils.pathFor('home'));
		},

		// Called when any submit operation fails
		onError: function(formType, err) {
			console.log("onError called! " + err);
			sAlert.error(err || err.reason);
			//alert(err || err.reason);
		},

	}
});

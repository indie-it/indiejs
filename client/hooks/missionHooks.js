AutoForm.hooks({
	'insertOrUpdateMission': {

		// Called when form does not have a `type` attribute
		onSubmit: function (insertdoc, updatedoc, currentdoc) {
			console.log("onSubmit")
			var self = this;
			var insert = function () {
				console.log("mission.insert");
				Meteor.call("mission.insert", insertdoc, function (error, result) {
					if (error) {
						self.done(error); // Appelle onError
						return;
					}
					if (result) {
						self.done(); // Appelle onSuccess
					}
				});
			};
			var update = function () {
				console.log("mission.update");

				Globals.schemas.MissionSchema.clean(updatedoc);

				Meteor.call("mission.update", currentdoc._id, updatedoc, function (err, result) {
					if (err) {
						console.log("error", err);
						self.done(err); // Appelle onError
						return;
					}
					self.done(); // Appelle onSuccess
				});
			};

			if (!currentdoc) {
				Session.set("mission", { isInsert: true });
				insert();
			} else {
				Session.set("mission", { isUpdate: true });
				update();
			}

			return false;
		},

		// Called when any submit operation succeeds
		onSuccess: function () {
			var obj = Session.get("mission");

			if (!obj || obj.isInsert === true) {
				sAlert.success('La mission a bien été créée!', { onRouteClose: false });
				Router.go(Utils.pathFor('home'));
				return;
			}

			if (obj.isUpdate === true) {
				sAlert.success('La mission a bien été mise à jour!');
			}
		},

		// Called when any submit operation fails
		onError: function (formType, err) {
			sAlert.error(err.message);
		},

	},
});

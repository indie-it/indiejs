var cloudinarycallback = function (doc, callback) {
	console.log("cloudinarycallback called");
	console.log(doc);
	console.log("###");

	// stockage de l'image de profil sur cloudinary
	Cloudinary.upload(files, { width: 400, height: 400, gravity: "face", radius: "max", crop: "fill" }, function (err, result) {
		if (err) {
			sAlert.error(err.message);
			return;
		}
		if (result) {
			var obj = {
				size: result.bytes,
				//createdAt: result.created_at,
				etag: result.etag,
				format: result.format,
				height: result.height,
				publicId: result.public_id,
				resourceType: result.resource_type,
				secureUrl: result.secure_url,
				signature: result.signature,
				type: result.type,
				url: result.url,
				version: result.version,
				width: result.width
			};

			if (doc.$set) {
				// vérification: l'utilisateur avait-il déjà une image de profil?
				// dans ce cas, il faut la supprimer!
				//if (doc.$set.profilePic) {

				//}

				// cas de la mise à jour ; doc est un objet complexe contenant deux propriétés 
				// $set et $unset; il faut ajouter la propriété à $set.
				doc.$set.profilePic = obj;
			}
			else {
				// dans le cas de l'insertion, pas de souci; on met à jour directement l'object doc.
				doc.profilePic = obj;
			}

			console.log("### hook !!!")
			console.log(doc)

			callback();
		}
	});
};

AutoForm.hooks({

	'freelancer.createorupdate.skills': {
		onSubmit: function (insertdoc, updatedoc, currentdoc) {

			var self = this;

			var section = Session.get("freelancerProfileEditMenu");
			console.log("section : " + section);

			// nouveau profil.
			if (!currentdoc) {

				// on mémorise qu'on est en insertion
				Session.set("user-profile", { isInsert: true });

				// création de profil
				Meteor.call("userprofile.insert", insertdoc, section, function (err, result) {
					if (err) {
						console.log("error", err);
						self.done(err); // Appelle onError
						return;
					}
					self.done(); // Appelle onSuccess
				});
			}
			else {
				// mise à jour du profil : clean !
				Globals.schemas.UserProfilesSchema.clean(updatedoc.$set);

				// on mémorise qu'on est en mise à jour
				Session.set("user-profile", { isUpdate: true });

				// Mise à jour de profil
				Meteor.call('userprofile.updateWithId', updatedoc, self.docId, function (error) {
					if (error) {
						console.log("error", error);
						self.done(error); // Appelle onError
						return;
					}
					self.done(); // Appelle onSuccess
				});
			}
			return false;
		},
		onSuccess: function () {
			var obj = Session.get("user-profile");
			if (obj.isInsert === true) {
				sAlert.success("Profil enregistré", { onRouteClose: false });
				Router.go(Utils.pathFor('home'));
				return;
			}
			if (obj.isUpdate === true) {
				sAlert.success("Profil mis à jour");
			}
		},
		onError: function (formType, err) {
			var error = err.reason ? err.reason : err;
			sAlert.error('Erreur! ' + error);
		}

	},

	'freelancer.createorupdate.alert': {
		onSubmit: function (insertdoc, updatedoc, currentdoc) {
			console.log("freelancer.createorupdate.alert onSubmit");
			return false;

		},
		onSuccess: function () {
			Modal.hide();

			var obj = Session.get("user-profile");
			if (obj.isInsert === true) {
				sAlert.success("Profil enregistré", { onRouteClose: false });
				Router.go(Utils.pathFor('home'));
				return;
			}

			if (obj.isUpdate === true) {
				sAlert.success("Profil mis à jour");
			}
		},
		onError: function (formType, err) {
			Modal.hide();
			var error = err.reason ? err.reason : err;
			sAlert.error('Erreur! ' + error);
		}

	},

	'freelancer.createorupdate.details': {
		onSubmit: function (insertdoc, updatedoc, currentdoc) {
			console.log("freelancer.createorupdate.contact-details onSubmit");

			return false;
		},
		onSuccess: function () {
			Modal.hide();

			var obj = Session.get("user-profile");
			if (obj.isInsert === true) {
				sAlert.success("Profil enregistré", { onRouteClose: false });
				Router.go(Utils.pathFor('home'));
				return;
			}

			if (obj.isUpdate === true) {
				sAlert.success("Profil mis à jour");
			}
		},
		onError: function (formType, err) {
			Modal.hide();
			var error = err.reason ? err.reason : err;
			sAlert.error('Erreur! ' + error);
		}

	},

	'freelancer.createorupdate': {
		onSubmit: function (insertdoc, updatedoc, currentdoc) {

			var self = this;

			var section = Session.get("freelancerProfileEditMenu");
			console.log("section : " + section);

			// nouveau profil.
			if (!currentdoc) {

				// on mémorise qu'on est en insertion
				Session.set("user-profile", { isInsert: true });

				// création de profil
				Meteor.call("userprofile.insert", insertdoc, section, function (err, result) {
					if (err) {
						console.log("error", err);
						self.done(err); // Appelle onError
						return;
					}
					self.done(); // Appelle onSuccess
				});
			}
			else {
				// mise à jour du profil : clean !
				Globals.schemas.UserProfilesSchema.clean(updatedoc.$set);

				// on mémorise qu'on est en mise à jour
				Session.set("user-profile", { isUpdate: true });

				// Mise à jour de profil
				Meteor.call('userprofile.updateWithId', updatedoc, self.docId, function (error) {
					if (error) {
						console.log("error", error);
						self.done(error); // Appelle onError
						return;
					}
					self.done(); // Appelle onSuccess
				});
			}

			return false;
		},
		onSuccess: function () {
			var obj = Session.get("user-profile");
			if (obj.isInsert === true) {
				sAlert.success("Profil enregistré", { onRouteClose: false });
				Router.go(Utils.pathFor('home'));
				return;
			}
			if (obj.isUpdate === true) {
				sAlert.success("Profil mis à jour");
			}
		},
		onError: function (formType, err) {
			var error = err.reason ? err.reason : err;
			sAlert.error('Erreur! ' + error);
		}
	}
});

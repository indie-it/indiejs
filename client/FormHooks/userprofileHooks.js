var cloudinarycallback = function (doc, callback) {
	console.log("cloudinarycallback called");

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
				// cas de la mise à jour ; doc est un objet complexe contenant deux propriétés 
				// $set et $unset; il faut ajouter la propriété = $set.
				doc.$set.profilePic = obj;
			} else {
				// ds le cas de l'insertion, pas de souci; on met à jour directement l'object doc.
				doc.profilePic = obj;
			}

			console.log("### hook !!!")
			console.log(doc)

			callback();
		}
	});
};

AutoForm.hooks({

	'userprofile.createorupdate': {
		onSubmit: function (insertdoc, updatedoc, currentdoc) {
			var self = this;

			var saveCallback = function () {
				// création de profil
				Meteor.call("userprofile.insert", insertdoc, function (err, result) {
					if (err) {
						console.log("error", err);
						self.done(err); // Appelle onError
						return;
					}
					self.done(); // Appelle onSuccess
				});
			};
			var updateProfileCallback = function () {
				// Mise à jour de profil
				Meteor.call("userprofile.update", updatedoc, function (error) {
					if (error) {
						console.log("error", error);
						self.done(error); // Appelle onError
						return;
					}
					self.done(); // Appelle onSuccess
				});
			};

			Modal.show("userprofile-loading-modal", null, { backdrop: 'static', keyboard: false });

			// nouveau profil.
			if (!currentdoc) {
				if (!files) {
					saveCallback();
				} else {
					cloudinarycallback(insertdoc, saveCallback);
				}
			} else {
				// mise à jour du profil
				if (!files) {
					updateProfileCallback();
				} else {
					cloudinarycallback(updatedoc, updateProfileCallback);
				}
			}
			return false;
		},
		onSuccess: function () {
			Modal.hide();
			sAlert.success("Modifications sauvegardées", { onRouteClose: false });
			Router.go(Utils.pathFor('home'));
		},
		onError: function (formType, err) {
			Modal.hide();
			var error = err.reason ? err.reason : err;
			sAlert.error('Erreur! ' + error);
		}
	}
});

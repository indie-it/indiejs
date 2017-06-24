var cloudinarycallback = function (doc, callback) {
	console.log("cloudinarycallback called");

	// stockage de l'image de profil sur cloudinary
	Cloudinary.upload(files, { width: 400, height: 400, gravity: "face", radius: "max", crop: "fill" }, function (err, result) {

		if (err) {
			callback(err);
			return;
		}

		if (result) {
			var updateobj = {
				$set: {
					profilePic: {
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
					}
				}
			};

			callback(null, updateobj);
		}

	});
};


//freelancerProfileEdit

Template.freelancerProfileEdit.helpers({
	"getTemplateName": () => {
		var item = Session.get("freelancerProfileEditMenu") || "contact-details";

		var tpl = `freelancerProfileEdit_${item}`;

		console.log(tpl);

		return tpl;
	},
});
Template.freelancerProfileEdit.events({
	'click a': function (event) {
		console.log(event.target.id);
		Session.set("freelancerProfileEditMenu", event.target.id);
	},
});
Template.freelancerProfileEdit.rendered = () => {
	Session.set("freelancerProfileEditMenu", "details");
};

// freelancerProfileEdit_profilePic

Template.freelancerProfileEdit_profilePic.helpers({
	"getProfilePicSrc": function () {
		if (!this.profile || !this.profile.profilePic) {
			return "/img/profile-pic-placeholder.png";
		}
		return this.profile.profilePic.secureUrl;
	},
});
Template.freelancerProfileEdit_profilePic.events({

	"change input#profile-pic-file-input[type='file']": function (e) {
		// stocke le fichier en mémoire sur le navigateur
		files = e.currentTarget.files;

		if (!FileReader) { return; }

		var file = files[0];
		var reader = new FileReader();
		reader.onload = function () {
			document.getElementById('profile-pic-image').src = this.result;
		};

		reader.readAsDataURL(file);
	},

	"click #btn-profile-pic-update": (event) => {

		console.log(event.target.id);

		if (typeof (files) === 'undefined') {
			sAlert.error("Aucun fichier sélectionné!");
			return;
		}

		var tpl = Template.instance();


		//Meteor.call("userprofile.uploadProfilePic", tpl.data.profile._id, files, function (err, res) {
		//	console.log("result!")
		//	console.log(err);
		//	console.log(res);
		//});



		cloudinarycallback(tpl.data.profile, function (err, res) {

			console.log("callback sous-jacent appelé!");
			console.log(res);

			if (err) {
				sAlert.error(err.message);
				return;
			}

			sAlert.success("L'image de profil a été enregistrée avec succès.");

			Meteor.call('userprofile.updateProfilePic', tpl.data.profile._id, res, function (err) {
				if (err) {
					sAlert.error(err.message);
					return;
				}
				sAlert.success("Photo de profil mise à jour");
			});

		});

	},

});
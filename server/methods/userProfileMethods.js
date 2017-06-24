import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

Meteor.methods({

	"userprofile.insert": function (insertdoc) {
		console.log("userProfile.insert");

		insertdoc.userid = this.userId;
		insertdoc.createdAt = new Date();

		// force la mise à jour du champ availDate.
		if (insertdoc.isAvailable === true) {
			insertdoc.availDate = new Date();
		}

		// validation de l'objet
		Globals.schemas.UserProfilesSchema.validate(insertdoc);

		return UserProfiles.insert(insertdoc, function (err, objectid) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}
			console.log("Update successful!");
		});
		return true;
	},
	"userprofile.updateWithId": function (updatedoc, docId) {
		check(docId, String);

		console.log(`userProfile.updateWithId - docId: ${docId}`);

		// validation via le schéma défini
		Globals.schemas.UserProfilesSchema.validate(updatedoc.$set);

		// mise à jour
		UserProfiles.update(docId, updatedoc, function (err) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}
			console.log("Update successful!");
		});

		return true;
	},

	"userprofile.updateProfilePic": (docid, updateObj) => {

		check(docid, String);
		console.log(`userprofile.updateProfilePic - docid: ${docid}`);

		UserProfiles.update(docid, updateObj, function (err) {
			if (err) { throw Meteor.error("500", err.message); }

			if (!result) { return false; };

			return true;
		});


	},


	"freelancer.profilePic": (docid, files) => {

		console.log("freelancer.profilePic called");

		check(docid, String);

		// retrieve doc
		var profile = UserProfiles.findOne(docid);
		if (!profile) { throw new Meteor.Error("500", "Profil non trouvé."); }


		Meteor.apply('userprofile.uploadProfilePic', [files], { wait: true }, function (err, result) {

		});


	},

	"userprofile.uploadProfilePic": (docid, files) => {

		console.log("userprofile.uploadProfilePic");

		check(docid, String);

		console.log(files);

		let options = { width: 400, height: 400, gravity: "face", radius: "max", crop: "fill" };

		// stockage de l'image de profil sur cloudinary
		Cloudinary.uploader.upload(files, options, function (err, result) {

			if (err) { throw err; }

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

				return updateobj;
			}

		});
	},
});

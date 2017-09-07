import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

Meteor.methods({

	"freelance.insert": function (insertdoc) {
		console.log("freelance.insert");

		// force la mise à jour du champ availDate.
		if (insertdoc.isAvailable === true) {
			insertdoc.availDate = new Date();
		}

		// validation de l'objet
		Globals.schemas.FreelanceSchema.validate(insertdoc);

		return FreelanceProfile.insert(insertdoc, function (err, objectid) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}
			console.log("Update successful!");
		});
		return true;
	},

    "freelance.updateWithId": function (updatedoc, docId) {

        console.log("freelance.updateWithId");

		check(docId, String);

		console.log(`userProfile.updateWithId - docId: ${docId}`);

		// validation via le schéma défini
		Globals.schemas.FreelanceSchema.validate(updatedoc.$set);

		// mise à jour
		FreelanceProfile.update(docId, updatedoc, function (err) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}
			console.log("Update successful!");
		});
		return true;
	},

});

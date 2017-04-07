import {
	Meteor
} from 'meteor/meteor'
import SimpleSchema from 'simpl-schema';

Meteor.methods({
	"mission.insert": function(doc) {

		doc.createdAt = new Date();
		doc.authorId = this.userId;
		doc.authorName = Meteor.user().username;
		doc.interestedUserIds = [];
		doc.notinterestedUserIds = [];

		// validation du document envoyé par le client
		Globals.schemas.MissionSchema.validate(doc);

		// insertion dans la base
		return Missions.insert(doc);
	},
	"mission.interested": function(missionid) {
		console.log("mission.interested");

		// validation du paramètre
		new SimpleSchema({
			missionid: {
				type: String
			}
		}).validate({
			missionid
		});

		// récupération de la mission
		var mission = Missions.findOne({
			_id: missionid
		});
		if (!mission) {
			return false;
		}

		Missions.update(missionid, {
			$addToSet: {
				interestedUserIds: Meteor.userId()
			},
			$pullAll: {
				notinterestedUserIds: [Meteor.userId()]
			}
		}, function(err) {
			if (err) {
				throw new Meteor.Error(500, error.message);
				return;
			}
			console.log("Update successful!");
		});
		return true;
	},
	"mission.notinterested": function(missionid) {
		console.log("mission.notinterested");

		// validation du paramètre
		new SimpleSchema({
			missionid: {
				type: String
			}
		}).validate({
			missionid
		});

		// récupération de la mission
		var mission = Missions.findOne({
			_id: missionid
		});
		if (!mission) {
			return false;
		}

		Missions.update(missionid, {
			$addToSet: {
				notinterestedUserIds: Meteor.userId()
			},
			$pullAll: {
				interestedUserIds: [Meteor.userId()]
			}
		}, function(err) {
			if (err) {
				throw new Meteor.Error(500, error.message);
				return;
			}
			console.log("Update successful!");
		});
		return true;
	},
});

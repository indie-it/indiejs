import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema';

Meteor.methods({
	"mission.insert": function (doc) {


		doc.createdAt = new Date();
		doc.authorId = this.userId;
		doc.authorName = Meteor.user().username;
		doc.interestedUserIds = [];
		doc.notinterestedUserIds = [];

		// validation du document envoyé par le client
		Globals.schemas.MissionSchema.validate(doc);

		var missionName = doc.name;

		// insertion dans la base
		return Missions.insert(doc, function (err, objectId) {
			if (err) {
				throw new Meteor.Error('Erreur', err);
			}

			Actions.insert({
				actionType: 'mission-create',
				userid: Meteor.userId(),
				options: {
					mission: missionName,
					missionid: objectId,
					username: Meteor.user().username
				}
			}, function (err, objId) {
				if (err) {
					console.error(err);
				}
				console.log("Action enregistrée");
			});
		});
	},
	"mission.interested": function (missionid) {
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
		}, function (err) {
			if (err) {
				throw new Meteor.Error(500, error.message);
			}
			console.log("Update successful!");

			// enregistrement de l'action.
			Actions.insert({
				actionType: 'user-interested',
				userid: Meteor.userId(),
				options: {
					mission: mission.name,
					missionid: mission._id,
					username: Meteor.user().username
				}
			}, function (err, objId) {
				if (err) {
					console.error(err);
				}
				console.log("Action enregistrée");
			});
		});
		return true;
	},
	"mission.notinterested": function (missionid) {
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
		}, function (err) {
			if (err) {
				throw new Meteor.Error(500, error.message);
			}
			console.log("Update successful!");
			Actions.insert({
				actionType: 'user-not-interested',
				userid: Meteor.userId(),
				options: {
					mission: mission.name,
					missionid: mission._id,
					username: Meteor.user().username
				}
			}, function (err, objId) {
				if (err) {
					console.error(err);
				}
				console.log("Action enregistrée");
			});

		});
		return true;
	},
});

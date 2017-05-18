import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

Meteor.methods({

	"mission.insert": function (doc) {

		doc.currentState = {
			step: Lists.missionWorkflow.map.STEP_NEW,
			date: new Date()
		};
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
			console.log("Missions.insert ");
		});
	},
	"mission.update": function (docid, updateDoc) {

		//Globals.schemas.MissionSchema.validate(updateDoc.$set);

		return Missions.update(docid, { $set: updateDoc.$set, $unset: updateDoc.$unset }, function (err) {

			if (err) {
				throw new Meteor.Error(500, err);
			}

		});

	},

	"mission.interested": function (missionid) {
		console.log("mission.interested");

		// validation du paramètre
		new SimpleSchema({ missionid: { type: String } }).validate({ missionid });

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
		});
		return true;
	},

	"mission.getActions": function (missionid) {

		check(missionid, String);

		console.log(`mission.getActions: ${missionid}`);

		var mission = Missions.findOne({ _id: missionid });
		if (!mission) {
			throw new Meteor.Error(500, "Mission non trouvée.");
		}

		if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return {
				canArchive: false,
				canAccept: false,
				canValidate: false
			};
		}

		return MissionWorkflow.getActions(mission.currentState.step);
	},

	"mission.archive": function (missionid) {
		console.log(`mission.archive: ${missionid}`);

		check(missionid, String);

		// vérif mission
		var mission = Missions.findOne(missionid);
		if (!mission) {
			throw new Meteor.Error(500, "Mission non trouvée.");
		}

		// vérif action autorisée
		var actions = MissionWorkflow.getActions(mission.currentState.step);
		if (!actions.canArchive) {
			throw new Meteor.Error("Action non autorisée.");
		}

		Missions.update(missionid, {
			$set: {
				"currentState.step": Lists.missionWorkflow.map.STEP_ARCHIVED,
				"currentState.date": new Date()
			},

			// on vire le champ 'currentState.assignedUserId' s'il existe (ne fait rien sinon).
			$unset: { "currentState.assignedUserId": "" },

			$addToSet: {
				workflowHistory: mission.currentState
			}
		}, function (err) {

			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			console.log("Mission archivée");

			return true;
		});
	},
	"mission.accept": function (missionid, userid) {
		console.log(`mission.accept: missionid: ${missionid}, userid: ${userid}`);

		// vérif paramètres entrants !
		check(missionid, String);
		check(userid, String);

		// vérif mission
		var mission = Missions.findOne(missionid);
		if (!mission) {
			throw new Meteor.Error(400, "Mission non trouvée.");
		}

		// vérif action autorisée
		var actions = MissionWorkflow.getActions(mission.currentState.step);
		if (!actions.canAccept) {
			throw new Meteor.Error("Action non autorisée.");
		}

		Missions.update(missionid, {
			$set: {
				"currentState.step": Lists.missionWorkflow.map.STEP_IN_PROGRESS,
				"currentState.date": new Date(),
				"currentState.assignedUserId": userid
			},
			$addToSet: {
				workflowHistory: mission.currentState
			}
		}, function (err) {

			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			console.log("Mission acceptée!");

			return true;
		});

	},
	"mission.validate": function (missionid) {
		console.log(`mission.validate: ${missionid}`);
		check(missionid, String);

		// vérif mission
		var mission = Missions.findOne(missionid);
		if (!mission) {
			throw new Meteor.Error(400, "Mission non trouvée.");
		}

		// vérif action autorisée
		var actions = MissionWorkflow.getActions(mission.currentState.step);
		if (!actions.canValidate) {
			throw new Meteor.Error("Action non autorisée.");
		}

		Missions.update(missionid, {
			$set: {
				"currentState.step": Lists.missionWorkflow.map.STEP_VALIDATED,
				"currentState.date": new Date()
			},
			// on vire le champ 'currentState.assignedUserId' s'il existe (ne fait rien sinon).
			$unset: { "currentState.assignedUserId": "" },
			$addToSet: {
				workflowHistory: mission.currentState
			}
		}, function (err) {
			console.log(err);
			if (err) {
				throw new Meteor.Error(500, err.message);
			}

			console.log("Mission validée avec succès");

			return true;
		});

	},

});

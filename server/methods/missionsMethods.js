import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

Meteor.methods({

	"mission.insert": function (doc) {

		// "nettoyage" du doc : affectation des valeurs auto
		//Globals.schemas.MissionSchema.clean(doc);

		doc.currentState = {
			step: WorkflowConst.STEP_NEW,
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
			throw new Meteor.Error(400, "Mission non trouvée.");
		}

		// vérif action autorisée
		var actions = MissionWorkflow.getActions(mission.currentState.step);
		if (!actions.canArchive) {
			throw new Meteor.Error("Action non autorisée.");
		}

		Missions.update(missionid, {
			$set: {
				"currentState.step": WorkflowConst.STEP_ARCHIVED,
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

			Actions.insert({
				actionType: 'mission-archive',
				userid: Meteor.userId(),
				options: {
					mission: mission.name,
					missionid: missionid,
					username: Meteor.user().username,
				}
			}, function (err, objId) {
				if (err) {
					console.error(err);
				}
				console.log("Action enregistrée");
			});

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
				"currentState.step": WorkflowConst.STEP_IN_PROGRESS,
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

			Actions.insert({
				actionType: 'mission-accept',
				userid: Meteor.userId(),
				options: {
					mission: mission.name,
					missionid: missionid,
					username: Meteor.user().username,
				}
			}, function (err, objId) {
				if (err) {
					console.error(err);
				}
				console.log("Action enregistrée");
			});

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
				"currentState.step": WorkflowConst.STEP_VALIDATED,
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

			Actions.insert({
				actionType: 'mission-validate',
				userid: Meteor.userId(),
				options: {
					mission: mission.name,
					missionid: missionid,
					username: Meteor.user().username,
				}
			}, function (err, objId) {
				if (err) {
					console.error(err);
				}
				console.log("Action enregistrée");
			});

			console.log("Mission validée avec succès");

			return true;
		});

	},

});

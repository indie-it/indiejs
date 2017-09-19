import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { MissionWF } from '../../imports/modules/server/mission-workflow.js';

Meteor.methods({
	"mission.insert": function (doc) {

		var isRecruiter = Roles.userIsInRole(this.userId, Globals.roles.recruiter);
		if (isRecruiter) {
			console.log("recruteur!");
			var company = Companies.findOne({ 'userid': this.userId });
			if (company) {
				console.log("on stocke son id: ", company._id);
				doc.companyId = company._id;
			}
		}

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

	"mission.apply": function (missionid) {
		console.log("mission.apply");

		// validation du paramètre
		check(missionid, String);

		// récupération de la mission
		var mission = Missions.findOne({ _id: missionid });
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

		console.log(`mission.getActions: ${missionid}`);
		check(missionid, String);


		// vérif mission
		var mission = Missions.findOne(missionid);
		if (!mission) {
			throw new Meteor.Error(500, "Mission non trouvée.");
		}

		// workflow
		var wf = new MissionWF(mission);
		return wf.getActions();
	},

	"mission.transition": (missionid, actionid) => {
		console.log(`mission.transition: ${missionid}, ${actionid}`);

		check([missionid, actionid], [String]);

		// vérif mission
		var mission = Missions.findOne(missionid);
		if (!mission) {
			throw new Meteor.Error(500, "Mission non trouvée.");
		}

		// vérif action autorisée
		var wf = new MissionWF(mission);
		if (!wf.can(actionid)) {
			throw new Meteor.Error(`Action non autorisée (id d'action: ${actionid}).`);
		}

		// enregistrer la transition ds nv var
		var transition = wf.transition(actionid);
		if (!transition) {
			throw new Meteor.Error(500, `Transition "${actionid}" non trouvée.`);
		}

		// objet de mise à jour (mongo)
		var updateobj = {

			$set: {
				"currentState.step": transition,
				"currentState.date": new Date()
			},

			// on vire le champ 'currentState.assignedUserId' s'il existe (ne fait rien sinon).
			$unset: { "currentState.assignedUserId": "" },

			$addToSet: {
				workflowHistory: mission.currentState
			}
		};

		// Mise à jour
		Missions.update(missionid, updateobj, function (err) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}
			console.log("Action réalisée");
			return true;
		});

	},

	"mission.accept": function (missionid, userid) {
		console.log(`mission.accept: missionid: ${missionid}, userid: ${userid}`);

		// vérif paramètres entrants !
		console.log("checking missionid and userid...");
		check([missionid, userid], [String]);
		console.log("check done.");

		// vérif mission
		console.log("verifying mission...");
		var mission = Missions.findOne(missionid);
		console.log(mission);
		if (!mission) {
			console.error(new Meteor.Error(400, "Mission non trouvée."));
			throw new Meteor.Error(400, "Mission non trouvée.");
		}
		console.log("mission verified.");

		// vérif action autorisée
		console.log("verifying action...");
		var wf = new MissionWF(mission);
		if (!wf.can('mission-accept')) {
			console.error(new Meteor.Error("Action non autorisée."));
			throw new Meteor.Error("Action non autorisée.");
		}
		console.log("action verified.");

		var updateobj = {
			$set: {
				"currentState.step": wf.transition('mission-accept'),
				"currentState.date": new Date(),
				"currentState.assignedUserId": userid
			},
			$addToSet: {
				workflowHistory: mission.currentState
			}
		};

		Missions.update(missionid, updateobj, function (err) {

			if (err) {
				console.error(err);
				throw new Meteor.Error(500, err.message);
			}

			console.log("Mission acceptée!");

			return true;
		});

	},

});

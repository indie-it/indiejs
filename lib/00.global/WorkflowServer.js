////////////////////////////////
// Code spécifique au serveur //
////////////////////////////////


if (Meteor.isServer) {

	import SimpleSchema from 'simpl-schema';
	import { check } from 'meteor/check';


	// Schéma des étapes de WF
	Globals.schemas.WorkflowStepSchema = new SimpleSchema({

		id: {
			type: String,
		},
		name: {
			type: String,
		},
		description: {
			type: String,
			optional: true
		},
		next: {
			type: Array,
			optional: true
		},
		"next.$": {
			type: String,
		},

	});

	// Classe WorkflowStep
	class WorkflowStep {

		constructor(id, name, nextSteps) {

			Globals.schemas.WorkflowStepSchema.validate({
				id: id,
				name: name,
				next: nextSteps
			});

			this.id = id;
			this.name = name;
			this.next = nextSteps;
		}

		isStart() {
			return this.id === WorkflowConst.STEP_NEW;
		}

		isEnd() {
			return this.id === WorkflowConst.STEP_ARCHIVED;
		}

		test() {
			return `[${this.id}] "${this.name}"`;
		}

		canTransition(stepid) {

			new SimpleSchema({ stepid: { type: String } }).validate({ stepid });

			if (!this.next) { // || this.isEnd()) {
				return false;
			}

			if (_.indexOf(this.next, stepid) !== -1) {
				return true;
			}

			return false;
		}
	}


	MissionWorkflow = {};
	MissionWorkflow.steps = [];
	MissionWorkflow.steps.push(new WorkflowStep(WorkflowConst.STEP_NEW, "Nouveau besoin (non validé)", [WorkflowConst.STEP_VALIDATED, WorkflowConst.STEP_ARCHIVED]));
	MissionWorkflow.steps.push(new WorkflowStep(WorkflowConst.STEP_VALIDATED, "Mission validée", [WorkflowConst.STEP_IN_PROGRESS, WorkflowConst.STEP_ARCHIVED]));
	MissionWorkflow.steps.push(new WorkflowStep(WorkflowConst.STEP_IN_PROGRESS, "Mission en cours", [WorkflowConst.STEP_ARCHIVED]));
	MissionWorkflow.steps.push(new WorkflowStep(WorkflowConst.STEP_ARCHIVED, "Mission archivée", [WorkflowConst.STEP_VALIDATED]));

	var getMission = function (stepid) {
		check(stepid, String);
		return _.findWhere(MissionWorkflow.steps, { id: stepid });
	};
	MissionWorkflow.getActions = function (stepid) {

		console.log(`MissionWorkflow.getActions(${stepid})`)

		check(stepid, String);

		var mission = getMission(stepid);
		if (!mission) {
			return { canArchive: false, canAccept: false, canValidate: false };
		}

		return {
			canArchive: mission.canTransition(WorkflowConst.STEP_ARCHIVED),
			canAccept: mission.canTransition(WorkflowConst.STEP_IN_PROGRESS),
			canValidate: mission.canTransition(WorkflowConst.STEP_VALIDATED)
		};
	};

}
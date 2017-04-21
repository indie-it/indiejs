// on sort si on est sur le client!
if (Meteor.isClient) { return; }

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

WorkflowConst = {
	'STEP_NEW': 'new',
	'STEP_VALIDATED': 'validated',
	'STEP_IN_PROGRESS': 'in-progress',
	'STEP_ARCHIVED': 'archived',
};

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

		if (!this.next || this.isEnd()) {
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
MissionWorkflow.steps.push(new WorkflowStep(WorkflowConst.STEP_ARCHIVED, "Mission archivée", []));

var getMission = function (stepid) {
	check(stepid, String);
	return _.findWhere(MissionWorkflow.steps, { id: stepid });
};
MissionWorkflow.getActions = function (stepid) {
	check(stepid, String);

	new SimpleSchema({ stepid: { type: String } }).validate({ stepid });
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


// TODO:  Les transitions permettront de gérer les wf directement ici, et l'UI en découlera directement.
//MissionWorkflow.transitions = [];
//MissionWorkflow.transitions.push({
//	name: 'validate',
//	text: "Valider la nouvelle mission",
//	from: WorkflowConst.STEP_NEW,
//	to: WorkflowConst.STEP_VALIDATED,
//});
//MissionWorkflow.transitions.push({
//	name: 'accept',
//	text: "Accepter la mission",
//	from: WorkflowConst.STEP_VALIDATED,
//	to: WorkflowConst.STEP_IN_PROGRESS,
//});
//MissionWorkflow.transitions.push({
//	name: 'archive-in-progress-to-archived',
//	text: "Archiver la mission",
//	from: WorkflowConst.STEP_IN_PROGRESS,
//	to: WorkflowConst.STEP_ARCHIVED,
//});
//MissionWorkflow.transitions.push({
//	name: 'archive-new-to-archived',
//	text: "Archiver la mission",
//	from: WorkflowConst.STEP_NEW,
//	to: WorkflowConst.STEP_ARCHIVED,
//});
//MissionWorkflow.transitions.push({
//	name: 'archive-validated-to-archived',
//	text: "Archiver la mission",
//	from: WorkflowConst.STEP_VALIDATED,
//	to: WorkflowConst.STEP_ARCHIVED,
//});

//var getTransition = function (stepid) {
//	check(stepid, String);
//	return _.findWhere(MissionWorkflow.transitions, { from: stepid });
//};
//MissionWorkflow.getTransitions = function (stepid) {
//	check(stepid, String);
//};

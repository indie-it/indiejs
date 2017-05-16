import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

// Schéma des étapes de WF
Globals.schemas.WorkflowStepSchema = new SimpleSchema({

	id: String,
	name: String,
	description: { type: String, optional: true },
	next: { type: Array, optional: true },
	"next.$": String,

});

// Classe WorkflowStep
class WorkflowStep {

	constructor(id, name, nextSteps) {

		Globals.schemas.WorkflowStepSchema.validate({ 'id': id, 'name': name, 'next': nextSteps });

		this.id = id;
		this.name = name;
		this.next = nextSteps;
	}

	isStart() {
		return this.id === Lists.missionWorkflow.map.STEP_NEW;
	}

	isEnd() {
		return this.id === Lists.missionWorkflow.map.STEP_ARCHIVED;
	}

	test() {
		return `[${this.id}] "${this.name}"`;
	}

	canTransition(stepid) {

		check(stepid, String);

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
MissionWorkflow.steps.push(new WorkflowStep(Lists.missionWorkflow.map.STEP_NEW, "Nouveau besoin (non validé)", [Lists.missionWorkflow.map.STEP_VALIDATED, Lists.missionWorkflow.map.STEP_ARCHIVED]));
MissionWorkflow.steps.push(new WorkflowStep(Lists.missionWorkflow.map.STEP_VALIDATED, "Mission validée", [Lists.missionWorkflow.map.STEP_IN_PROGRESS, Lists.missionWorkflow.map.STEP_ARCHIVED]));
MissionWorkflow.steps.push(new WorkflowStep(Lists.missionWorkflow.map.STEP_IN_PROGRESS, "Mission en cours", [Lists.missionWorkflow.map.STEP_ARCHIVED]));
MissionWorkflow.steps.push(new WorkflowStep(Lists.missionWorkflow.map.STEP_ARCHIVED, "Mission archivée", [Lists.missionWorkflow.map.STEP_VALIDATED]));

MissionWorkflow.transitions = {};
MissionWorkflow.transitions.values = [
	{
		name: Lists.actions.map.missionValidate,
		from: Lists.missionWorkflow.map.STEP_NEW,
		to: Lists.missionWorkflow.map.STEP_VALIDATED,
	},
	{
		name: Lists.actions.map.missionArchive,
		from: Lists.missionWorkflow.map.STEP_NEW,
		to: Lists.missionWorkflow.map.STEP_ARCHIVED,
	},
	{
		name: Lists.actions.map.missionAccept,
		from: Lists.missionWorkflow.map.STEP_VALIDATED,
		to: Lists.missionWorkflow.map.STEP_IN_PROGRESS,
	},
	{
		name: Lists.actions.map.missionArchive,
		from: Lists.missionWorkflow.map.STEP_VALIDATED,
		to: Lists.missionWorkflow.map.STEP_ARCHIVED,
	},
	{
		name: Lists.actions.map.missionArchive,
		from: Lists.missionWorkflow.map.STEP_IN_PROGRESS,
		to: Lists.missionWorkflow.map.STEP_ARCHIVED,
	},
	{
		name: Lists.actions.map.missionUnarchive,
		from: Lists.missionWorkflow.map.STEP_ARCHIVED,
		to: Lists.missionWorkflow.map.STEP_VALIDATED,
	},
];
MissionWorkflow.transitions.get = function (from, to) {
	check([from, to], [String]);
	console.log(`MissionWorkflow.transitions.get('${from}', '${to}')`);
	return _.findWhere(MissionWorkflow.transitions.values, { from: from, to: to });
};


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
		canArchive: mission.canTransition(Lists.missionWorkflow.map.STEP_ARCHIVED),
		canAccept: mission.canTransition(Lists.missionWorkflow.map.STEP_IN_PROGRESS),
		canValidate: mission.canTransition(Lists.missionWorkflow.map.STEP_VALIDATED)
	};
};



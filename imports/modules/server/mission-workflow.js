import { check } from 'meteor/check';
import changeCase from 'change-case';


// liste des étapes
var steps = {}
steps.values = [
	{ id: 'new', text: "Nouveau besoin (non validé)" },
	{ id: 'validated', text: "Mission validée" },
	{ id: 'in-progress', text: "Mission en cours" },
	{ id: 'archived', text: "Mission archivée" },
];


// liste des transitions
var transitions = {};
transitions.values = [
	{ id: 'mission-validate', text: "Valider", from: 'new', to: 'validated', fa: 'fa-check', btnclass: 'btn-success' },
	{ id: 'mission-accept', text: "Affecter un indépendant", from: 'validated', to: 'in-progress', fa: 'fa-user-circle', btnclass: 'btn-primary', isSpecific: true },
	{ id: 'mission-archive', text: "Archiver", from: 'new', to: 'archived', fa: 'fa-archive', btnclass: 'btn-danger' },
	{ id: 'mission-archive', text: "Archiver", from: 'validated', to: 'archived', fa: 'fa-archive', btnclass: 'btn-danger' },
	{ id: 'mission-archive', text: "Archiver", from: 'in-progress', to: 'archived', fa: 'fa-archive', btnclass: 'btn-danger' },
	{ id: 'mission-unarchive', text: "Déterrer", from: 'archived', to: 'validated', fa: 'fa-history', btnclass: 'btn-warning' },
];
transitions.get = (from, to) => {
	check([from, to], [String]);
	return _.findWhere(transitions.values, { 'from': from, 'to': to });
};
transitions.getFrom = (from) => {
	check(from, String);
	return _.where(transitions.values, { 'from': from });
};
transitions.getById = (id) => {
	check(id, String);
	return _.findWhere(transitions.values, { 'id': id });
}


/**
 * Classe représentant un WF de mission
 */
class MissionWF {

	/**
	 * Constructeur de WF de mission
	 * @param {any} missionId
	 */
	constructor(mission) {
		this.mission = mission;
		this.self = this;
	}

	/**
	 * Etape en cours
	 */
	current() {
		// récupération de l'état courant via l'objet mission
		var current = (this.mission) ? this.mission.currentState.step : 'none';
		console.log(`## MissionWF.current() => ${current}`);
		return current;
	}

	/**
	 * Retourne l'objet transition stocké dans le tableau des transitions à partir de son id.
	 * @param {String} transitionId
	 */
	transition(transitionId) {
		var to = transitions.getById(transitionId).to;
		console.log(`## MissionWF.transition(${transitionId}) -> ${to}`);
		return to;
	}

	/**
	 * récupère la liste des actions possibles en fct de l'étape actuelle
	 */
	getActions() {

		var current = this.current();
		console.log(`## getActions [current:${current}]`);

		if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return {};
		}

		// récup des transitions possibles
		var allowedTransitions = transitions.getFrom(current);
		console.log(allowedTransitions);
		return allowedTransitions;

		//var allowedTransitionsObj = _.object(_.map(allowedTransitions, (item) => { return [changeCase.camelCase(`can-${item.id}`), true]; }));
		//console.log(allowedTransitionsObj);
		//return allowedTransitionsObj;
	}

	/**
	 * 
	 * @param {any} action
	 */
	can(action) {
		if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
			console.log(`## can(${action}): false (not admin)`);
			return false;
		}
		var allowedTransitions = transitions.getFrom(this.current());
		var transac = _.findWhere(allowedTransitions, { 'id': action });
		//console.log(transac);
		var allowed = transac ? true : false;
		console.log(`## can(${action}): ${allowed}`);
		return allowed;
	}

	/**
	 * Récupère une transition
	 * @param {any} from
	 * @param {any} to
	 */
	getTransition(from, to) {
		return transitions.get(from, to);
	}

};
export { MissionWF, transitions };

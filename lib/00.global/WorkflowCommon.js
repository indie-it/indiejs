//////////////////////////////////////////
// Code ex�cut� sur client et serveur.	//
//////////////////////////////////////////


WorkflowInfo = {
	STEP_NEW: { id: 'new', text: "Nouvelle mission" },
	STEP_VALIDATED: { id: 'validated', text: "Mission valid�e"  },
	STEP_IN_PROGRESS: { id: 'in-progress', text: "Mission affect�e"  },
	STEP_ARCHIVED: { id: 'archived', text: "Mission archiv�e"  },
};
//var test = _.map(WorkflowInfo, function (obj, key) { return key; });
//console.log(test);

WorkflowConst = {
	'STEP_NEW': 'new',
	'STEP_VALIDATED': 'validated',
	'STEP_IN_PROGRESS': 'in-progress',
	'STEP_ARCHIVED': 'archived',
};
WorkflowIds = _.map(WorkflowConst, function (obj, key) { return obj; });

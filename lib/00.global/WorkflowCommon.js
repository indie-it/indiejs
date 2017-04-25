//////////////////////////////////////////
// Code exécuté sur client et serveur.	//
//////////////////////////////////////////


WorkflowInfo = {
	STEP_NEW: { id: 'new', text: "Nouvelle mission" },
	STEP_VALIDATED: { id: 'validated', text: "Mission validée"  },
	STEP_IN_PROGRESS: { id: 'in-progress', text: "Mission affectée"  },
	STEP_ARCHIVED: { id: 'archived', text: "Mission archivée"  },
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

Accounts.onCreateUser((options, user) => {

	console.log("[ accountsHooks.js ] Accounts.onCreateUser");

	if (!options.profile) {
		throw new Meteor.Error(500, "L'utilisateur doit avoir un profil.");
	}

	var role = Lists.roles.map.freelancer;
	if (options.profile.type === Lists.roles.map.recruiter) {
		role = Lists.actions.map.recruiter;
	}
	var action = {
		'actionType': Lists.actions.map.userCreate,
		'userid': user._id,
		'options': {
			'username': user.username,
			'role': role,
		}
	};

	console.log(action);

	// Journalisation de l'action
	Actions.insert(action, (err, objId) => {
		if (err) {
			console.error(err);
		}
		console.log("Action enregistrée");
	});

	return user;

});
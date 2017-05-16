Companies.after.insert(function (userId, doc) {

	console.log("Companies.after.insert");

	var companyNameAndField = doc.name;
	if (doc.field) {
		companyNameAndField += ` (${doc.field})`;
	}

	var action = {
		actionType: Lists.actions.map.profileRecruiterCreate,
		userid: userId,
		options: {
			company: companyNameAndField,
			companyid: doc._id,
			username: Meteor.user().username
		}
	};

	Actions.insert(action, function (err, objId) {
		if (err) {
			console.error(err);
		}
		console.log("Action enregistrée");
	});

});
Companies.after.update(function (userId, doc, fieldNames, modifier, options) {

	console.log("Companies.after.update");

	var companyNameAndField = doc.name;
	if (doc.field) {
		companyNameAndField += ` (${doc.field})`;
	}

	var action = {
		actionType: Lists.actions.map.profileRecruiterUpdate,
		userid: userId,
		options: {
			company: companyNameAndField,
			companyid: doc._id,
			username: Meteor.user().username
		}
	};

	Actions.insert(action, function (err, objId) {
		if (err) {
			console.error(err);
		}
		console.log("Action enregistrée");
	});

});

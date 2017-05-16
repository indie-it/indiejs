//Invitation.after.insert(function (userId, doc) {

//	console.log("Invitation.after.insert");

//	var action = {
//		'actionType': Lists.actions.map.inviteCreate,
//		'userid': Meteor.userId(),
//	};

//	Actions.insert(action, function (err, objId) {
//		if (err) {
//			console.error(err);
//		}
//		console.log("Action enregistrée");
//	});

//	//Meteor.call("");

//});
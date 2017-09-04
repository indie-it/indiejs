Tos.after.insert(function (userId, doc) {

    console.log("Tos.after.insert");
    
    console.log(doc);

	var action = {
		'actionType': Lists.actions.map.tosAccept,
		'userid': doc.userid,
		'options': {
			'username': doc.username
		}
	};

	Actions.insert(action, function (err, objId) {
		if (err) {
			console.error(err);
		}
		console.log("Action enregistrée");
	});

});

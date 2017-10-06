Template.applicationLayout.events({
	'click .logout': function(event) {
		event.preventDefault();
		Meteor.logout();
		sAlert.success("Vous venez d'être déconnecté.", { onRouteClose: false });
		Router.go(Utils.pathFor('home'));
	}
});

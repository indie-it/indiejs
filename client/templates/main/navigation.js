Template.navigation.events({
	'click .logout': function(event) {
		event.preventDefault();
		Meteor.logout();
		Router.go(Utils.pathFor('home'))
	}
});


Template.navigation.helpers({
	"getCurrentClass": function(route) {
		 var currentRoute = Router.current().route.getName();
		//  console.log("### currentRoute: " + currentRoute + ", route: " + route);
		 return route === currentRoute ? "active" : "";
	},
});



// Template.navigation.rendered = function() {
// 	console.log("### Template.navigation.rendered");
// 	console.log(this);
// 	console.log("### Template.navigation.rendered");
// };

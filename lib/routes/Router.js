Router.configure({
	layoutTemplate: 'layout'
});
Router.onBeforeAction(function () {
	// all properties available in the route function
	// are also available here such as this.params

	if (!Meteor.userId()) {
		// if the user is not logged in, render the Login template
		this.render('login');
	} else {
		// otherwise don't hold up the rest of hooks or our route/action function
		// from running
		this.next();
	}
}, {
		except: ['user.register']
	});

Router.route('/', {
	name: 'home',
	template: 'home',
	data: function () {
		console.log("/home - data");
		var dbactions = Actions.find({}, {
			sort: {
				createdAt: -1
			}
		});
		console.log("count: " + dbactions.count());
		return {
			actions: dbactions
		};
	},
	waitOn: function () {
		console.log("/home - waitOn");
		return Meteor.subscribe('actions.all.sortedByDateDesc');
	}
});

﻿//import { Session } from 'meteor/session';

Router.configure({
	loadingTemplate: 'loading',
	layoutTemplate: 'layout',
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
}, { except: ['user.register', 'company.register'] });
Router.route('/', {
	name: 'home',
	template: 'home',
	data: function () {
		if (!this.ready() || !Meteor.userId()) { return; }

		const actions = Actions.find({}, { sort: { createdAt: -1 } });
		const profile = UserProfiles.findOne({ userid: Meteor.userId() });

		return {
			actions: actions,
			hasProfile: !!profile
		};
	},
	waitOn: function () {
		if (!Meteor.userId()) { return; }
		return [
			Meteor.subscribe('actions.missions.sortedByDateDesc'),
			Meteor.subscribe('userprofile.get'),
		];
	}
});


//import { Session } from 'meteor/session';

Router.configure({
	loadingTemplate: 'loading',
	layoutTemplate: 'layout',
	notFoundTemplate: "notFound",
});

Router.onBeforeAction(function () {
	// all properties available in the route function
	// are also available here such as this.params

	if (!Meteor.userId()) {
		// if the user is not logged in, render the Login template
		console.log("hereeeeee1 - not logged in!");
		this.render('login');
		return;
	}

	// if the user's not accepted the tos, show'em:
	var tos = Tos.find({ userid: Meteor.userId() });
	if (tos.count() > 0) {

		// don't hold up the rest of hooks or our route/action function from running
		console.log("hereeeeee 4 - user's accepted the tos");
		this.next();
		return;
	}

	// no data found for current user : tos not accepted yet
	console.log("hereeeeee 2 - no data found for current user");
	this.render('pageCgu', {
		data: function() {
			return {
				tosAccepted: false,
				test: "ceci est un test"
			 };
		},
	});

}, { except: [
	'home',
	'login',
	'passwordReset',
	'passwordRecover',
	'user.register',
	'company.register',
	'fonctionnement',
	'fonctionnementEntreprise',
	'cgu',
	'mentions-legales',
	'nos-valeurs',
] });

Router.route('/', {
	name: 'home',
	template: 'home',
	data: function () {

		if (!this.ready()) { return; }

		//const actions = Actions.find({}, { sort: { createdAt: -1 } });
		const profile = UserProfiles.findOne({ userid: Meteor.userId() });
		const profilesCount = UserProfiles.find({}).count();
		//const companiesCount = Companies.find({}).count();

		var tosAccepted = false;
		if (Meteor.userId()) {
			const tos = Tos.find({ userid: Meteor.userId() });
			tosAccepted = (tos.count() > 0);
		}

		return {
			//actions: actions,
			hasProfile: !!profile,
			profilesCount: profilesCount,
			//companiesCount: companiesCount,
			tosNotAccepted: !tosAccepted,
		};
	},
	waitOn: function () {
		//if (!Meteor.userId()) { return; }
		return [
			//Meteor.subscribe('actions.missions.sortedByDateDesc'),
			Meteor.subscribe('userprofile.get'),
			Meteor.subscribe('userprofile.getCount'),
			Meteor.subscribe('tos.getForCurrentUser'),
		];
	}
});
Router.route('/admin', {
	name: 'admin',
	template: 'admin',
	data: function () {
		if (!this.ready() || !Meteor.userId()) { return; }

		const actions = Actions.find({}, { sort: { createdAt: -1 } });

		return {
			actions: actions,
		};
	},
	waitOn: function () {
		if (!Meteor.userId()) { return; }
		return [
			Meteor.subscribe('actions.missions.sortedByDateDesc'),
			Meteor.subscribe('tos.getForCurrentUser'),
		];
	}
});
Router.route('/fonctionnement', {
	name: 'fonctionnement',
	template: 'fonctionnement',
});
Router.route('/fonctionnement-entreprise', {
	name: 'fonctionnementEntreprise',
	template: 'fonctionnementEntreprise',
});
Router.route('/cgu', {
	name: 'cgu',
	template: 'pageCgu',
	data: function () {
		if (!this.ready() || !Meteor.userId()) { return; }

		const tosInfo = Tos.findOne({ userid: Meteor.userId() });
		var tosAccepted = (tosInfo);
		console.log(`tosAccepted: ${ tosAccepted }`);
		return {
			tosAccepted: tosAccepted,
			tosInfo: tosInfo,
		};
	},
	waitOn: function () {
		if (!Meteor.userId()) { return; }

		return [
			Meteor.subscribe('tos.getForCurrentUser'),
		];
	},
});
Router.route('/mentions-legales', {
	name: 'mentions-legales',
	template: 'page-mentions-legales',
});
Router.route('/nos-valeurs', {
	name: 'nos-valeurs',
	template: 'nos-valeurs',
});

//Router.route('/invite', {
//	name: 'invite',
//	template: 'invite',
//});

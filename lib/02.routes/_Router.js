//import { Session } from 'meteor/session';

Router.configure({
	loadingTemplate: 'loading',
	layoutTemplate: 'layout',
	notFoundTemplate: "notFound",
});

// // Apply the layout, if none is found the Iron Router nothing happens here
// // and IR uses the standard ones
// var IR_BeforeHooks;
// IR_BeforeHooks = {
// 	isLoggedIn: function(pause) {
// 		if (!(Meteor.loggingIn() || Meteor.user())) {
// 		  Notify.setError(__('Please login.'));
//           this.render('login');
//           pause();
//         }
//     },
// 	tosAccepted: function() {
//
// 	},
// };

Router.onBeforeAction(function () {
	// all properties available in the route function
	// are also available here such as this.params

	if (!Meteor.userId()) {
		// if the user is not logged in, render the Login template
		this.render('login');
		return;
	}

	// if the user's not accepted the tos, show'em:
	var tos = Tos.find({ userid: Meteor.userId() });
	if (tos.count() > 0) {

		// don't hold up the rest of hooks or our route/action function from running
		this.next();
		return;
	}

	// no data found for current user : tos not accepted yet
	this.render('pageCgu', {
		data: function() {
			return {
				tosAccepted: false,
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

		// profils :
		const profile = FreelanceProfile.findOne({ userid: Meteor.userId() });
		const profilesCount = FreelanceProfile.find({}).count();

		// notifs :
		const notifOptions = {
			'sort': { date: -1 },
			'transform': (doc) => {
				console.log("transform");

				var action = Lists.actions.get(doc.actionid);
				if (action) {
					doc.action = action;
				}

				return doc;
			},
		};
		const notifications = Meteor.userId() ? Notifications.find({ userid: Meteor.userId() }, notifOptions) : null;
		const notificationsCount = Meteor.userId() ? Notifications.find({ userid: Meteor.userId(), read: false, }).count() : 0;

		var tosAccepted = false;
		if (Meteor.userId()) {
			const tos = Tos.find({ userid: Meteor.userId() });
			tosAccepted = (tos.count() > 0);
		}

		return {
			hasProfile: !!profile,
			profilesCount: profilesCount,
			tosNotAccepted: !tosAccepted,
			notifications: notifications,
			notificationsCount: notificationsCount,
		};
	},
	waitOn: function () {
		return [
			Meteor.subscribe('freelance.get'),
			Meteor.subscribe('freelance.getCount'),
			Meteor.subscribe('tos.getForCurrentUser'),
			Meteor.subscribe('notifications.getForCurrentUser'),
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

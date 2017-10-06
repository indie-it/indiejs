Router.configure({
	loadingTemplate: 'loading',
	layoutTemplate: 'applicationLayout',
	notFoundTemplate: 'notFound',
	waitOn: () => {
		console.log("### [Router.configure] waitOn ###");
		return [
			Meteor.subscribe('tos.getForCurrentUser'),
			Meteor.subscribe('notifications.getForCurrentUser'),
		];
	},
	//onBeforeAction: 'loading',
	// onBeforeAction: '' () => {
	// 	console.log("[Router.configure] onBeforeAction");
	// 	this.next();
	// },
});

Router.onBeforeAction(function () {
	console.log("[Router.onBeforeAction]");

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

// Contrôleur parent (dont héritent les autres contrôleurs)
ApplicationController = RouteController.extend({
	data: () => {
        console.log('[ApplicationController.data()] child params: ', this.params);
		// notifs :
		const notifOptions = {
			'sort': { date: -1 },
			'transform': (doc) => {
				var action = Lists.actions.get(doc.actionid);
				if (action) { doc.action = action; }
				return doc;
			},
		};
		const notifications = Meteor.userId() ? Notifications.find({ userid: Meteor.userId() }, notifOptions) : null;
		const notificationsCount = Meteor.userId() ? Notifications.find({ userid: Meteor.userId(), read: false, }).count() : 0;

		return {
			'notifications': notifications,
			'notificationsCount': notificationsCount,
		};
	},
});


// Définition des routes (et des contrôleurs)
HomeController = ApplicationController.extend({
	data: function() {
		console.log('[HomeController] data - child params: ', this.params);

		console.log("Router.route('/') data");

		if (!this.ready()) { return; }

		// profils :
		const profile = FreelanceProfile.findOne({ userid: Meteor.userId() });
		const profilesCount = FreelanceProfile.find({}).count();

		var tosAccepted = false;
		if (Meteor.userId()) {
			const tos = Tos.find({ userid: Meteor.userId() });
			tosAccepted = (tos.count() > 0);
		}

		var homeData = {
			'hasProfile': !!profile,
			'profilesCount': profilesCount,
			'tosNotAccepted': !tosAccepted,
		};


		// appelle le contrôleur parent!
		var appData = HomeController.__super__.data.call(this);

		// étend les données (donénes parent + données actuelles)
		var data = _.extend(appData, homeData); // using underscore!

		return data;
	},
	waitOn: function () {
		console.log("Router.route('/') waitOn");
		return [
			Meteor.subscribe('freelance.get'),
			Meteor.subscribe('freelance.getCount'),
		];
	},
});
AdminController = ApplicationController.extend({
	data: function () {
		console.log('[AdminController] data - child params: ', this.params);

		if (!this.ready() || !Meteor.userId()) { return; }

		const actions = Actions.find({}, { sort: { createdAt: -1 } });

		var adminData = {
			actions: actions,
		};

		// appelle le contrôleur parent!
		var appData = AdminController.__super__.data.call(this);

		// étend les données (donénes parent + données actuelles)
		var data = _.extend(appData, adminData); // using underscore!

		return data;
	},
	waitOn: function () {
		if (!Meteor.userId()) { return; }
		return [
			Meteor.subscribe('actions.missions.sortedByDateDesc'),
		];
	}
});
Router.route('/', {
	name: 'home',
	template: 'home',
	controller: 'HomeController',
});
Router.route('/admin', {
	name: 'admin',
	template: 'admin',
	controller: 'AdminController',
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


// Routes en lien avec l'objet Freelance
FreelanceViewController = ApplicationController.extend({
	data: function () {
		console.log("FreelanceViewController.data");

		if (!this.ready() || !Meteor.userId()) { return; }

		console.log(`[/freelance/view/] data - (_id = ${this.params._id})`);

		// récupération du profil à partir de l'id en paramètre
		var doc = FreelanceProfile.findOne(this.params._id);

		console.log(doc);

		var accounts = Meteor.users.find();
		console.log(accounts);


		// récupération du compte utilisateur lié (via userid);
		var account = Meteor.users.findOne(doc.userid);

		var obj = {
			'id': this.params._id,
			'doc': doc,
			'account': account,
		};

		// appelle le contrôleur parent!
		var appData = FreelanceViewController.__super__.data.call(this);

		// étend les données (donénes parent + données actuelles)
		var data = _.extend(appData, obj); // using underscore!

		return data;
	},
	waitOn: function () {

		console.log(`[/freelance/view/] waitOn (_id = ${this.params._id})`);

		return [
			Meteor.subscribe('user.getByFreelanceProfileId', this.params._id),
			Meteor.subscribe('freelance.getById', this.params._id),
		];
	}
});
FreelanceUpdateByUserIdController = ApplicationController.extend({
	data: function () {
		if (!this.ready() || !Meteor.userId()) { return; }

		console.log(`[/freelance/update] data - ${Meteor.userId()}`);

		var profile = FreelanceProfile.findOne({ 'userid': Meteor.userId() });
		var userHasProfile = false;
		if (!!profile) {
			userHasProfile = true;
		}
		var obj = {
			'userHasProfile': userHasProfile,
			'id': Meteor.userId(),
			'profile': profile
		};
		// On utilise  underscore pour fusionner les données
		return _.extend(FreelanceViewController.__super__.data.call(this), obj);
	},
	waitOn: function () {
		console.log(`[/freelance/update] waitOn - userId = ${Meteor.userId()}`);
		return [
			Meteor.subscribe('freelance.getByUserId', Meteor.userId()),
		];
	},
});
FreelanceUpdateByProfileIdController = ApplicationController.extend({
	data: function () {
		console.log(`[/freelance/update/:_id] _id = ${this.params._id}`);
		var profile = FreelanceProfile.findOne(this.params._id);
		var userHasProfile = false;
		if (!!profile) {
			userHasProfile = true;
		}

		var obj = {
			'userHasProfile': userHasProfile,
			'id': this.params._id,
			'profile': profile
		};

		return _.extend(
			FreelanceViewController.__super__.data.call(this),
			obj
		);
	},
	waitOn: function () {
		console.log(`[/freelance/update/:_id] waitOn - _id = ${this.params._id}`);
		return [
			Meteor.subscribe('freelance.getById', this.params._id),
		];
	},
});
Router.route('/freelance/view/:_id', {
    name: 'freelance-profile',
	template: 'freelance-profile',
    controller: 'FreelanceViewController',
});
Router.route('/freelance/list', {
    name: 'freelance-list',
    template: 'freelance-list',
	controller: 'ApplicationController',
});
Router.route('/freelance/update', {
    name: 'freelance-update',
	template: 'freelance-update',
	controller: 'FreelanceUpdateByUserIdController',
});
Router.route('/freelance/update/:_id', {
	name: 'freelance-update-id',
	template: 'freelance-update',
	controller: 'FreelanceUpdateByProfileIdController',
});


// missions
MissionViewController = ApplicationController.extend({
	data: function () {
		if (!this.ready()) { return; }

		console.log(`/mission/view/${this.params._id} - data`);

		var mission = Missions.findOne({ _id: this.params._id });
		var actions = Actions.find({}, { sort: { createdAt: -1 } });

		var obj = {
			'id': this.params._id,
			'mission': mission,
			'actions': actions,
		};
		return _.extend(MissionViewController.__super__.data.call(this), obj);
	},
	waitOn: function () {
		console.log(`/mission/view/${this.params._id} - waitOn`);
		return [
			Meteor.subscribe("mission.getById", this.params._id),
			Meteor.subscribe("actions.missions.getWithMissionId", this.params._id),
		];
	},
});
Router.route('/mission/view/:_id', {
	name: 'mission',
	controller: 'MissionViewController'
});
Router.route('/mission/search', {
	name: 'missionSearch',
	controller: 'ApplicationController',
});
MissionListController = ApplicationController.extend({
	data: function () {
		var obj = { 'missions': Missions.find({}, { sort: { createdAt: -1 } }) };
		return _.extend(MissionListController.__super__.data.call(this), obj);
	},
	waitOn: function () {
		return [
			Meteor.subscribe('missions.headers'),
		];
	}
});
Router.route('/mission/list', {
	name: 'missionsList',
	controller: 'MissionListController'
});
Router.route('/mission/create', {
	name: 'missionCreate',
	controller: "ApplicationController",
});
MissionUpdateController = ApplicationController.extend({
	data: function () {
		if (!this.ready()) { return; }
		console.log(`/mission/update/${this.params._id} - data`);
		var obj = {
			'id': this.params._id,
			'mission': Missions.findOne({ _id: this.params._id }),
			'actions': Actions.find({}, { sort: { createdAt: -1 } }),
		};
		return _.extend(MissionUpdateController.__super__.data.call(this), obj);
	},
	waitOn: function () {
		console.log(`/mission/update/${this.params._id} - waitOn`);
		return [
			Meteor.subscribe("mission.getById", this.params._id),
			Meteor.subscribe("actions.missions.getWithMissionId", this.params._id),
		];
	},
});
Router.route('/mission/update/:_id', {
	name: "missionUpdate",
	template: "missionUpdate",
	controller: "MissionUpdateController",
});


// Routes pour les objets société
CompanyListController = ApplicationController.extend({
	data: function () {
		if (!this.ready()) { return; }
		var obj = {
			'companies': Companies.find({}, {sort : { updated: -1 } })
		};
		return _.extend(CompanyListController.__super__.data.call(this), obj);
	},
	waitOn: function () {
		return [
			Meteor.subscribe('company.getHeaders'),
		];
	},
});
Router.route('/company/list', {
	name: 'companyList',
	template: 'companyList',
	controller: 'CompanyListController',
});
CompanyUpdateController = ApplicationController.extend({
	data: function () {
		if (!this.ready()) { return; }
		var obj = { 'company': Companies.findOne({ userid: Meteor.userId() }) };
		return _.extend(CompanyUpdateController.__super__.data.call(this), obj);
	},
	waitOn: function () {
		return Meteor.subscribe('company.get');
	},
});
Router.route('/company/update', {
	name: 'companyUpdate',
	template: 'companyUpdate',
	controller: 'CompanyUpdateController',
});
CompanyViewController = ApplicationController.extend({
	data: function () {
		if (!this.ready()) { return; }
		var obj = { 'company': Companies.findOne(this.params._id) };
		return _.extend(CompanyViewController.__super__.data.call(this), obj);
	},
	waitOn: function () {
		return [
			Meteor.subscribe('company.getById', this.params._id),
		];
	},
});
Router.route('/company/:_id', {
	name: 'company',
	template: 'company',
	controller: 'CompanyViewController',
});

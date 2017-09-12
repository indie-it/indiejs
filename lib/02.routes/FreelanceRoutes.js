import { Meteor } from 'meteor/meteor';

Router.route('/freelance/view/:_id', {
    name: 'freelance-profile',
	template: 'freelance-profile',
    data: function () {
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
        console.log(obj);
        return obj;
	},
	waitOn: function () {

        console.log(`[/freelance/view/] waitOn (_id = ${this.params._id})`);

		return [
            Meteor.subscribe('user.getByFreelanceProfileId', this.params._id),
            Meteor.subscribe('freelance.getById', this.params._id),
            Meteor.subscribe('tos.getForCurrentUser'),
		];
	 }
});
Router.route('/freelance/update', {
    name: 'freelance-update',
	template: 'freelance-update',
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
        console.log(obj);
        return obj;
	},
	waitOn: function () {
		console.log(`[/freelance/update] waitOn - userId = ${Meteor.userId()}`);
		return [
            Meteor.subscribe('freelance.getByUserId', Meteor.userId()),
            Meteor.subscribe('tos.getForCurrentUser'),
		];
    },
});
Router.route('/freelance/update/:_id', {
	name: 'freelance-update-id',
	template: 'freelance-update',
	data: function () {
		 console.log(`[/freelance/update/:_id] _id = ${this.params._id}`);
		var profile = FreelanceProfile.findOne(this.params._id);
		var userHasProfile = false;
		if (!!profile) {
			userHasProfile = true;
		}
		return {
			'userHasProfile': userHasProfile,
			'id': this.params._id,
			'profile': profile
		};
	},
	waitOn: function () {
		console.log(`[/freelance/update/:_id] waitOn - _id = ${this.params._id}`);
		return [
            Meteor.subscribe('freelance.getById', this.params._id),
            Meteor.subscribe('tos.getForCurrentUser'),
		];
    },
});
Router.route('/freelance/list', {
    name: 'freelance-list',
    template: 'freelance-list',
	waitOn: function () {
		console.log(`[/freelance/update] waitOn - userId = ${Meteor.userId()}`);
		return [
            Meteor.subscribe('tos.getForCurrentUser'),
		];
    },
});

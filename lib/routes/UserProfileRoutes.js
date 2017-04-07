import {
	Meteor
} from 'meteor/meteor';

Router.route('/profile/view', {
	name: 'profile.view',
	template: 'profile',
	data: function() {
		console.log("[profile/view] data - userId = " + Meteor.userId());
		var profile = UserProfiles.findOne({
			userid: Meteor.userId()
		});
		return {
			profile: profile
		};
	},
	waitOn: function() {
		console.log("[/profile/view] waitOn -  userid = " + Meteor.userId());
		return Meteor.subscribe('userprofile.getByUserId', Meteor.userId());
	}
});
Router.route('/profile/view/:_id', {
	name: 'profile',
	template: 'profile',
	data: function() {
		console.log("profile/view/:_id] data - userProfileId = " + this.params._id);
		var profile = UserProfiles.findOne({
			_id: this.params._id
		});
		return {
			id: this.params._id,
			profile: profile
		};
	},
	waitOn: function() {
		console.log("[/profile/view/:_id] waitOn -  userid = " + this.params._id);
		return Meteor.subscribe('userprofile.getById', this.params._id);
	}
});
Router.route('/profile/update', {
	name: 'profile.update',
	template: 'update',
	data: function() {
		console.log("[/profile/update] data - userId = " + Meteor.userId());
		var profile = UserProfiles.findOne({
			userid: Meteor.userId()
		});
		var userHasProfile = false;
		if (!!profile) {
			userHasProfile = true;
		}
		return {
			userHasProfile: userHasProfile,
			id: this.params._id,
			profile: profile
		};
	},
	waitOn: function() {
		console.log("[/profile/update] waitOn - userId = " + Meteor.userId());
		return Meteor.subscribe('userprofile.getByUserId', Meteor.userId());
	}
});
Router.route('/profile/list', {
	name: 'profile.list',
	template: 'list',
	data: function() {
		console.log("/profile/list - data");
		var dbProfiles = UserProfiles.find({}, {
			sort: {
				isAvailable: -1,
				availDate: 1,
				updated: 1
			}
		});
		return {
			profiles: dbProfiles
		};
	},
	waitOn: function() {
		console.log("/profile/list - waitOn");
		return Meteor.subscribe('userprofile.getHeaders');
	}
});

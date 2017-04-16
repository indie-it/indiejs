import { Meteor } from 'meteor/meteor';

Router.route('/mission/view/:_id', {
	name: 'mission',

	// this template will be rendered until the subscriptions are ready
	loadingTemplate: 'loading',

	data: function () {
		console.log(`/mission/view/${this.params._id} - data`);
		var mission = Missions.findOne({
			_id: this.params._id
		});
		return {
			id: this.params._id,
			mission: mission,
		};
	},
	waitOn: function () {
		console.log(`/mission/view/${this.params._id} - waitOn`);
		return Meteor.subscribe("mission.getById", this.params._id);
	},

});
Router.route('/mission/create', {
	name: 'missionCreate'
});
Router.route('/mission/list', {
	name: 'missionsList',

	loadingTemplate: 'loading',

	data: function () {
		var dbMissions = Missions.find({}, { sort: { createdAt: -1 } });
		return {
			missions: dbMissions
		};
	},

	waitOn: function () {
		return Meteor.subscribe('missions.headers');
	}
});
Router.route('admin/mission/list', {
	name: 'missionsListAdmin',

	loadingTemplate: 'loading',

	data: function () {
		var dbMissions = Missions.find({}, { sort: { createdAt: -1 } });
		return {
			missions: dbMissions
		};
	},

	waitOn: function () {
		return Meteor.subscribe('missions.headersAdmin');
	}
});

import { Meteor } from 'meteor/meteor';

Router.route('/mission/view/:_id', {
	name: 'mission',
	data: function () {
		if (!this.ready()) { return; }

		console.log(`/mission/view/${this.params._id} - data`);

		var mission = Missions.findOne({ _id: this.params._id });
		var actions = Actions.find({}, { sort: { createdAt: -1 } });

		return {
			id: this.params._id,
			mission: mission,
			actions: actions,
		};
	},
	waitOn: function () {
		console.log(`/mission/view/${this.params._id} - waitOn`);
		return [
			Meteor.subscribe("mission.getById", this.params._id),
			Meteor.subscribe("actions.missions.getWithMissionId", this.params._id),
		];
	},

});
Router.route('/mission/create', {
	name: 'missionCreate'
});
Router.route('/mission/list', {
	name: 'missionsList',
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

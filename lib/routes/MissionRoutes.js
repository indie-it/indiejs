import {
	Meteor
} from 'meteor/meteor';


Router.route('/mission/view/:_id', {
	name: 'mission',
	data: function() {
		console.log(" /mission/view/" + this.params._id + " - data");

		var mission = Missions.findOne({
			_id: this.params._id
		});

		return {
			id: this.params._id,
			mission: mission
		};
	},
	waitOn: function() {
		// return Meteor.subscribe('allMissions');
		console.log(" /mission/view/" + this.params._id + " - waitOn");
		return Meteor.subscribe("missionById", this.params._id);
	}
});
Router.route('/mission/create', {
	name: 'missionCreate'
});
Router.route('/mission/list', {
	name: 'missionsList',
	data: function() {
		var dbMissions = Missions.find({}, { sort: { createdAt: -1 }});
		return {
			missions: dbMissions
		};
	},
	waitOn: function() {

		return Meteor.subscribe('missions.headers');
	}
});

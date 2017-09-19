import { Random } from 'meteor/random';

Router.route('/linkedin', {
	name: "linkedin",
	template: 'linkedin',
	data: function () {
		if (!this.ready()) { return; }

		var obj = LinkedInStuff.findOne(Meteor.userId());
		if (!obj) {
			return { state: Random.id() };
		}

		var now = new Date();
		if (obj.accessTokenExpirationDate && now < obj.accessTokenExpirationDate) {
			var ret = { accessToken: true };
			if (obj.linkedinInfo) { ret.linkedinInfo = obj.linkedinInfo; }
			console.log(ret);
			return ret;
		}

		return { state: Random.id() };
	},
	waitOn: function () {
		return [
			Meteor.subscribe('user.linkedin.get'),
			// Meteor.subscribe('tos.getForCurrentUser'),
		];
	},
});
Router.route('/linkedin/callback', {
	name: "linkedinCallback",
	template: "linkedinCallback",
	data: function () {

		if (!this.ready()) { return; }

		if (this.params.query.error) {
			return { success: false, error: this.params.query.error_description };
		}

		if (!this.params.query.code || !this.params.query.state) {
			return { success: false, error: "Paramètres d'URL manquants" };
		}

		Meteor.call("user.linkedin.getAuthenticationToken", this.params.query.state, this.params.query.code, function (err, res) {
			if (!err) {
				console.log("call done");
				Router.go(Utils.pathFor('linkedin'));
			}
		});

		return {
			success: true,
			error: ""
		};

	},
	waitOn: function () {
		return [
			Meteor.subscribe('user.linkedin.get'),
			// Meteor.subscribe('tos.getForCurrentUser'),
		];
	},
});

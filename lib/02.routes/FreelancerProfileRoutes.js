Router.route('/freelancer/update/:_id', {
	name: 'freelancerProfileEdit',
	template: 'freelancerProfileEdit',
	data: function () {
		if (!this.ready()) { return; }

		console.log(`[/profile/updateWithId] data - profileId: ${this.params._id}`);
		var profile = UserProfiles.findOne(this.params._id);

		var userHasProfile = false;
		if (!!profile) {
			userHasProfile = true;
		}
		return {
			userHasProfile: userHasProfile,
			id: this.params._id,
			profile: profile,
			profileSkills: profile.skills || [],
		};
	},
	waitOn: function () {
		console.log(`[/profile/updateWithId] waitOn - profileId: ${this.params._id}`);
		return Meteor.subscribe('userprofile.getById', this.params._id);
	}
});

Router.route('/freelancer/update/contactDetails/:_id', {
	name: 'freelancerProfileEdit_contact-details',
	template: 'freelancerProfileEdit_contact-details',
});
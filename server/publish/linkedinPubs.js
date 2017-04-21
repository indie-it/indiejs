import SimpleSchema from 'simpl-schema';

Meteor.publish('user.linkedin.get', function () {

	console.log("user.linkedin.get");

	if (!this.userId) {
		this.stop();
		return;
	}

	console.log(`this.userId: ${this.userId}`)

	return LinkedInStuff.find(this.userId, {
		fields: {
			state: 1,
			accessTokenCreationDate: 1,
			accessTokenExpirationDate: 1,
			linkedinInfo: 1,
		}
	});
});

Template.home.helpers({

	"hasActions": function () {
		if (!this.actions) {
			return false;
		}
		return this.actions.count() > 0;
	},

});

Template.home.events({

	"click #sendMail": function (event, template) {
		// Client: Asynchronously send an email.
		Meteor.call(
			'email.send',
			'Quentin <kwentinn@gmail.com>',
			'[Test] Météor, ça réagit bien quand même!',
			`This is a test of Email.send. C'est bien, ça marche? Je mets un peu de français dans ce mail pour voir.`
		);
	},

});
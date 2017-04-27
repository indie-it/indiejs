Router.route('/company', {
	name: 'company',
	template: 'company',

});
Router.route('/company/update', {
	name: 'companyUpdate',
	template: 'companyUpdate',
	data: function () {
		if (!this.ready()) { return; }

		console.log("companyUpdate");

		var company = Companies.findOne({ userid: Meteor.userId() });

		return {
			'company': company
		};
	},
	waitOn: function () {
		return Meteor.subscribe('company.get');
	},
});

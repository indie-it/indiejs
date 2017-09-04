Router.route('/company/list', {
	name: 'companyList',
	template: 'companyList',
	data: function () {
		if (!this.ready()) {
			return;
		}
		var companies = Companies.find({}, {sort : { updated: -1 } });
		return {
			companies: companies
		};
	},
	waitOn: function () {
		return [
			Meteor.subscribe('company.getHeaders'),
			Meteor.subscribe('tos.getForCurrentUser'),
		];
	},
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
		return [
			Meteor.subscribe('company.get'),
			Meteor.subscribe('tos.getForCurrentUser'),
		];
	},
});
Router.route('/company/:_id', {
	name: 'company',
	template: 'company',
	data: function () {
		if (!this.ready()) { return; }

		return Companies.findOne(this.params._id);
	},
	waitOn: function () {
		return [
			Meteor.subscribe('company.getById', this.params._id),
			Meteor.subscribe('tos.getForCurrentUser'),
		];
	},
});

Router.route('/register', {
	name: "user.register",
	template: "register",
});

Router.route('/company/register', {
	name: "company.register",
	template: "companyRegister",
});

Router.route('/login', {
	name: "login",
	template: "login",
});

Router.route('/password-reset', {
	name: "passwordReset",
	template: "passwordReset",
});
Router.route('/password-recover/:_token', {
	name: "passwordRecover",
	template: "passwordRecover",
	data: function () {
		return {
			'token': this.params._token
		};
	},
});

Router.route('/logout', {
	name: "user.logout",
	template: "logout",
});

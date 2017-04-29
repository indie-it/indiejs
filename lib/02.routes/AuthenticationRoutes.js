Router.route('/register', {
	name: "user.register",
	template: "register"
});

Router.route('/company/register', {
	name: "company.register",
	template: "companyRegister"
});

Router.route('/login', {
  name: "login",
  template: "login"
});

Router.route('/logout', {
  name: "user.logout",
  template: "logout"
});


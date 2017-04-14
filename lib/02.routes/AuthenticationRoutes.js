Router.route('/register', {
  name: "user.register",
  template: "register"
});

Router.route('/login', {
  name: "user.login",
  template: "login"
});

Router.route('/logout', {
  name: "user.logout",
  template: "logout"
});

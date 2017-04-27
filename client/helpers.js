import SimpleSchema from 'simpl-schema';

Template.registerHelper('getGlobal', function (varName) {
	return Globals[varName];
});
Template.registerHelper('setTitle', function (title) {
	if (!title) {
		title = Globals.appName;
	} else {
		title += " - " + Globals.appName;
	}

	document.title = title;
});
Template.registerHelper("formatDateMoisAnnee", function (date) {
	return moment(date).format('MMMM YYYY');
});
Template.registerHelper('formatDate', function (date) {
	if (!date)
		return "";
	return moment(date).format('DD/MM/YYYY');
});
Template.registerHelper('formatDate2', function (date) {
	return moment(date).format('DD/MM/YYYY HH:mm');
});
Template.registerHelper("allcaps", function (text) {
	return text.toUpperCase();
});
Template.registerHelper("getYear", function (date) {
	return moment(date).format('YYYY');
});
Template.registerHelper("timeFromNow", function (date) {
	return moment(date).fromNow();
});
Template.registerHelper("timeToNow", function (date) {
	console.log("## timeToNow " + date);
	return moment([date.getFullYear(), date.getMonth(), date.getDate()]).toNow();
	// return moment(date).toNow();
});
Template.registerHelper("print", function (argument) {
	console.log(argument);
	return argument;
});
Template.registerHelper("getCurrentClass", function (route) {
	var currentRoute = Router.current().route.getName();
	return route === currentRoute ? "active" : "";
});

Template.registerHelper("isAdmin", function (route) {
	return Roles.userIsInRole(Meteor.userId(), Globals.roles.admin);
});
Template.registerHelper("isFreelancer", function (route) {
	return Roles.userIsInRole(Meteor.userId(), Globals.roles.freelancer);
});
Template.registerHelper("isRecruiter", function (route) {
	return Roles.userIsInRole(Meteor.userId(), Globals.roles.recruiter);
});

import SimpleSchema from 'simpl-schema';

Template.registerHelper('getGlobal', function(varName) {
	return Globals[varName];
});
Template.registerHelper('setTitle', function(title) {
	if (!title) {
		title = Globals.appName;
	} else {
		title += " - " + Globals.appName;
	}

	document.title = title;
});
Template.registerHelper("formatDateMoisAnnee", function(date) {
	return moment(date).format('MMMM YYYY');
});
Template.registerHelper('formatDate', function(date) {
	return moment(date).format('DD/MM/YYYY');
});
Template.registerHelper('formatDate2', function(date) {
	return moment(date).format('DD/MM/YYYY HH:mm');
});
Template.registerHelper("allcaps", function(text) {
	return text.toUpperCase();
});
Template.registerHelper("getYear", function(date) {
	return moment(date).format('YYYY');
});
Template.registerHelper("timeFromNow", function(date) {
	return moment(date).fromNow();
});
Template.registerHelper("timeToNow", function(date) {
	console.log("## timeToNow " + date);
	return moment([date.getFullYear(), date.getMonth(), date.getDate()]).toNow();
	// return moment(date).toNow();
});
Template.registerHelper("print", function(argument){
	console.log(argument);
	return argument;
});

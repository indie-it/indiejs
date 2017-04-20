//import SimpleSchema from 'simpl-schema';

Meteor.publish('skills.getAll', function () {
	console.log("skills.getAll");
	return Skills.find({});
});

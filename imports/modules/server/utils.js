import { check } from 'meteor/check';

const getAdmins = () => {
	var adminRole = Globals.roles.admin;
	console.log(`\tgetAdmins: adminRole = ${adminRole}`);
	return Roles.getUsersInRole(adminRole).fetch();
};
const getRelativeMissionUri = (missionId) => {
	return Utils.pathFor('mission', { '_id': missionId });
}
const getRelativeProfileUri = (profileId) => {
	return Utils.pathFor('freelance-profile', { '_id': profileId });
}
const getAbsoluteMissionUri = (missionId) => {
	var uri = Utils.pathFor('mission', { '_id': missionId });
	return Meteor.absoluteUrl(uri);
}
const getAbsoluteProfileUri = (profileId) => {
	var uri = Utils.pathFor('freelance-profile', { '_id': profileId });
	return Meteor.absoluteUrl(uri);
}

export default {
	getAdmins,
	getRelativeMissionUri,
	getRelativeProfileUri,
	getAbsoluteMissionUri,
	getAbsoluteProfileUri,
};

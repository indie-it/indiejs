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

// Returns an object containing added/deleted items.
const getArrayDifferences = function (oldSources, newSources) {
    console.log('getDifferences');

    var itemFound = false,
        oldObj = null,
        newObj = null,
        i = 0,
        j = 0;
    var differences = {
        added: [],
        deleted: []
    };

    // 1. Manages deleted items
    for (i = 0; i < oldSources.length; i++) {
        itemFound = false;
        oldObj = oldSources[i];
        for (j = 0; j < newSources.length; j++) {
            newObj = newSources[j];
            if (oldObj == newObj) {
                itemFound = true;
                break;
            }
        }
        if (!itemFound) {
            differences['deleted'].push(oldObj);
        }
    }

    // 2. Manages added items
    for (i = 0; i < newSources.length; i++) {
        itemFound = false;
        newObj = newSources[i];
        for (j = 0; j < oldSources.length; j++) {
            oldObj = oldSources[j];
            if (newObj == oldObj) {
                itemFound = true;
                break;
            }
        }
        if (!itemFound) {
            differences['added'].push(newObj);
        }
    }

    return differences;
};

export default {
	getAdmins,
	getRelativeMissionUri,
	getRelativeProfileUri,
	getAbsoluteMissionUri,
	getAbsoluteProfileUri,
	getArrayDifferences,
};

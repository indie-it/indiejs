import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import escapeStringRegexp from 'escape-string-regexp';

Meteor.publish('missions.headers', function () {
	console.log("missions.headers");
	return Missions.find({

		// on ne récupère que les missions dont l'état = 'active'
		"currentState.step": Lists.missionWorkflow.map.STEP_VALIDATED,

		// on retire les missions qui n'intéressent pas l'utilisateur courant.
		notinterestedUserIds: { $ne: this.userId }

	}, {
			fields: {
				description: 0,
				author: 0
			},
			sort: {
				createdAt: 1
			}
		});
});

Meteor.publish('missions.headersAdmin', function () {
	return Missions.find({}, { fields: { description: 0, author: 0 }, sort: { updated: -1, createdAt: -1 } });
});

Meteor.publish("mission.getById", function (missionId) {
	// We need to check the `listId` is the type we expect
	check(missionId, String);

	return Missions.find({ _id: missionId });
});

Meteor.publish('mission.search', function (search) {

	check(search, Match.OneOf(Object, null, undefined));

	//uniquement l'étape "validé"
	let query = { $and: [{ "currentState.step": Lists.missionWorkflow.map.STEP_VALIDATED }] };
	let projection = { limit: 10, sort: { updated: -1, createdAt: -1 } };

	if (search) {

		if (search.name) {
			query.$and.push({ 'name': new RegExp(escapeStringRegexp(search.name), 'i') });
		}
		if (search.description) {
			query.$and.push({
				$or: [
					{ 'description': new RegExp(escapeStringRegexp(search.description), 'i') },
					{ 'shortDescription': new RegExp(escapeStringRegexp(search.description), 'i') },
				]
			});
		}
		if (search.technos && search.technos.length > 0 && search.technos[0] !== '') {
			_.each(search.technos, (item) => {
				if (item) query.$and.push({ 'technos': new RegExp(escapeStringRegexp(item.trim()), 'i') });
			});
		}
		if (search.tjm && search.tjm > 0) {
			query.$and.push({ 'averageDailyRate.min': { $gte: parseInt(search.tjm) } });
		}
		if (search.location) {
			query.$and.push({ 'location': new RegExp(escapeStringRegexp(search.location), 'i') });
		}
		if (search.category) {
			query.$and.push({ 'categories': new RegExp(escapeStringRegexp(search.category), 'i') });
		}
		if (search.start) {
			query.$and.push({ 'start': { $gte: new Date(search.start) } });
		}

		//console.log(query);
		projection.limit = 100;
	}

	return Missions.find(query, projection);
});
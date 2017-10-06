Utils = {
	'formatDate': (date) => {
		if (date instanceof Date) {
			return moment(date).format('DD/MM/YYYY');
		}
	},
	'pathFor': (routeName, params) => {
		// Similaire au helper "pathFor", mais utilisable directement dans le code
		var route = Router.routes[routeName].path(params);
		return route;
	},
	'getTjmText': (mission) => {
		// console.log("Utils.getTjmText");
		if (!mission.averageDailyRate || (!mission.averageDailyRate.min && !mission.averageDailyRate.max)) {
			return "Non renseigné";
		}
		if (mission.averageDailyRate.min && !mission.averageDailyRate.max) {
			return `A partir de ${mission.averageDailyRate.min} €/j`;
		}
		if (!mission.averageDailyRate.min && mission.averageDailyRate.max) {
			return `${mission.averageDailyRate.max} €/j maximum`;
		}
		return `Entre ${mission.averageDailyRate.min} et ${mission.averageDailyRate.max} €/j`;
	},
	'getMissionDurationText': (mission) => {
		if (!mission.duration) {
			return "";
		}
		var days = mission.duration;
		if (days >= 20) {
			var months = days / 20;
			return `${moment.duration(months, 'months').humanize()} (${days}j)`;
		}
		return moment.duration(mission.duration, 'days').humanize();
	},
	'getMissionStartText': (mission) => {
		if (!!mission.isEarliestStart) {
			return "Début au plus tôt";
		}
		return "Début le " + Utils.formatDate(mission.start);
	},
};

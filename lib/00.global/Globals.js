Globals = {

	appName: "indie.it",
	appDesc: "La plateforme communautaire des indépendants IT",
	schemas: {},
	linkedin: {
		redirectUri: `${Meteor.absoluteUrl()}linkedin/callback`,
		clientId: '77o3kr1iy6djb5',
	},
	roles: {
		admin: 'admin',
		freelancer: 'freelancer',
		recruiter: 'recruiter',
	},
	tabular: {
		language: { url: `${Meteor.absoluteUrl()}json/data-tables-fr.json` },
	},
};

Globals = {

	appName: "indie.it",
	appDesc: "La plateforme communautaire des indépendants IT",
	// on stockera aussi nos schémas ici...
	schemas: {},
	linkedin: {
		redirectUri: `${Meteor.absoluteUrl()}linkedin/callback`,
		clientId: '77o3kr1iy6djb5',
	},
	roles: {
		ADMIN: 'admin',
		FREELANCER: 'freelancer',
		RECRUITER: 'recruiter',
	},
};

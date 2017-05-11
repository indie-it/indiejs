Globals = {

	appName: "Indie IT",
	appMotto: "Independant IT",
	appDesc: "La plateforme communautaire des indépendants IT",
	contact: "contact@indieit.fr",
	linkedinCompanyProfileUrl: 'https://www.linkedin.com/company-beta/11122494',

	schemas: {},

	linkedin: {
		redirectUri: Meteor.absoluteUrl('linkedin/callback'),
		clientId: '77o3kr1iy6djb5',
	},

	roles: {
		admin: 'admin',
		freelancer: 'freelancer',
		recruiter: 'recruiter',
	},
	tabular: {
		language: {
			url: Meteor.absoluteUrl('json/data-tables-fr.json'),
			decimal: ",",
			thousands: " "
		},
	},
};

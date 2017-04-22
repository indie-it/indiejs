if (Meteor.isServer) {
	ServerGlobals = {

		'linkedin': {
			'redirectUri': `${Meteor.absoluteUrl()}linkedin/callback`,
			'clientId': '77o3kr1iy6djb5',
			'clientSecret': 'KR6qpAuF54wY0wWf',
			'authTokenUri': 'https://www.linkedin.com/oauth/v2/accessToken',
		},

	};
	console.log(`Meteor.absoluteUrl(): ${Meteor.absoluteUrl()}`);
}
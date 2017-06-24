ServerGlobals = {};

ServerGlobals.cloudinary = {
	cloud_name: 'indieit',
	api_key: '365732358393369',
	api_secret: 'dKb0jm2L3bagef8eIeetUhiAY_k'
};

ServerGlobals.linkedin = {
	redirectUri: Meteor.absoluteUrl('linkedin/callback'),
	clientId: '77o3kr1iy6djb5',
	clientSecret: 'KR6qpAuF54wY0wWf',
	authTokenUri: 'https://www.linkedin.com/oauth/v2/accessToken',
};

ServerGlobals.smtp = {
	username: 'noreply@indieit.fr',
	password: 'bt2M5TjWKLpU',
	server: 'mail.gandi.net',
	port: 25
};

ServerGlobals.MAIL_URL = () => {
	return `smtp://${encodeURIComponent(ServerGlobals.smtp.username)}:${encodeURIComponent(ServerGlobals.smtp.password)}@${encodeURIComponent(ServerGlobals.smtp.server)}:${ServerGlobals.smtp.port}`;
};

ServerGlobals.invite = {};
ServerGlobals.invite.subject = () => { return "Indie IT - Invitation par email"; };
ServerGlobals.invite.text = (user, guestFirstName, guestLastName, url) => {
	return ` Bonjour ${guestFirstName} ${guestLastName},\n\n`
		+ `Vous venez de recevoir une invitation � rejoindre Indie IT, le r�seau des ind�pendants IT de Montpellier. Veuillez cliquer sur le lien suivant pour finaliser votre inscription:\n`
		+ `${url} \n\n`
		+ `Cordialement, \n`
		+ `L'�quipe Indie IT`;
};


ServerGlobals.alerts = {

	//envoyer une alerte email � la mise � jour de profil.
	profileNew: false,
	profileUpdate: false,


	//envoyer une alerte email � la mise � jour de soci�t�.
	companyNew: false,
	companyUpdate: false,


	//envoyer une alerte email � la mise � jour de mission.
	missionNew: false,
	missionUpdate: false,

};


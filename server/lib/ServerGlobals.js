ServerGlobals = {};

ServerGlobals.cloudinary = {
	cloud_name: 'indieit',
	api_key: '365732358393369',
	api_secret: 'dKb0jm2L3bagef8eIeetUhiAY_k'
};

ServerGlobals.linkedin = {
	redirectUri: `${Meteor.absoluteUrl()}linkedin/callback`,
	clientId: '77o3kr1iy6djb5',
	clientSecret: 'KR6qpAuF54wY0wWf',
	authTokenUri: 'https://www.linkedin.com/oauth/v2/accessToken',
};

//ServerGlobals.smtp = {
//	username: 'b2118e9d0ad1ee2893f08c98683b7f4c',
//	password: '0d85678267d284d088f08b4690f36d84',
//	server: 'in-v3.mailjet.com',
//	port: 25
//};
ServerGlobals.smtp = {
	username: 'noreply@indieit.fr',
	password: 'bt2M5TjWKLpU',
	server: 'mail.gandi.net',
	port: 25
};

ServerGlobals.MAIL_URL = function () {
	var smtp = `smtp://${encodeURIComponent(ServerGlobals.smtp.username)}:${encodeURIComponent(ServerGlobals.smtp.password)}@${encodeURIComponent(ServerGlobals.smtp.server)}:${ServerGlobals.smtp.port}`;
	console.log(smtp);
	return smtp;
};

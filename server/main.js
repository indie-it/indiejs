import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

	// POUR INFO :
	// Les objets/propriétés utilisés ici sont définis dans server/ lib / ServerGlobals.js)

	// config cloudinary 
	Cloudinary.config(ServerGlobals.cloudinary);
	Cloudinary.rules.delete = function () { return true; }

	// config serveur email 
	process.env.MAIL_URL = ServerGlobals.MAIL_URL();

});

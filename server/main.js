﻿import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

	Cloudinary.config({
		cloud_name: 'indieit',
		api_key: '365732358393369',
		api_secret: 'dKb0jm2L3bagef8eIeetUhiAY_k'
	});

	Cloudinary.rules.delete = function () {
		console.log(`${ userId }`);
		return true;
	}


});

import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Notifications = new Mongo.Collection('notifications');

// sécurité renforcée : on va effectuer ces tâches via des méthodes Meteor.
Notifications.deny({
	insert: function () { return true; },
	update: function () { return true; },
	remove: function () { return true; }
});

// Schéma du profil
Globals.schemas.NotificationsSchema = new SimpleSchema({

    'userid': { type: String, },
    'actionid': { type: String, },
	'objectid': { type: String, optional: true, },
    'date': { type: Date, },
	'read': { type: Boolean, defaultValue: false, optional: true, },

});
Notifications.attachSchema(Globals.schemas.NotificationsSchema);

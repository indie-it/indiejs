import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

//

Meteor.methods({
    "notification.markAsRead": function(notifid) {

        console.log();

        check(notifid, String);

        Notifications.update(notifid, { $set: { read: true } }, function(err) {
            if (err) {
                throw new Meteor.Error(500, err.message);
            }
            console.log("Update successful!");
        });
    }
});

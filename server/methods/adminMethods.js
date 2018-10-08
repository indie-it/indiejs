import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import emailNotification from '../../imports/modules/server/email-notification.js';

Meteor.methods({
    "admin.email.send" : (title, html) => {
        console.log("[admin.email.send] called!!!");

        check([title, html], [String]);
        emailNotification.sendAdminEmail('test', title, html);
    },
});

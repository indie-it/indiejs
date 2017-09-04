import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

Meteor.methods({

    "tos.accept":function(){

        console.log(`[tos.accept] this.userId: ${ this.userId }`);

        var tos = {
            'userid': this.userId,
            'username': Meteor.user().username,
            'accepted': true,
            'date': new Date
        };

        Tos.insert(tos, function(err, objectid) {
            if (err) {
                throw new Meteor.Error(500, err.message);
            }
            console.log("Tos insert successful!");
        });
    }

});

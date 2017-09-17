import { check } from 'meteor/check';

function create(actionid, userid, objectid) {

    console.log(`[notification-manager].create`);

    // vérifs de base
    check([actionid, userid, objectid], [String]);

    // création du document
    var doc = {
        'userid': userid,
        'actionid': actionid,
        'date': new Date,
    };

    if (objectid) {
        check(objectid, String);
        doc.objectid = objectid;
    }

    // on ajoute à la collection Notifications
    Notifications.insert(doc, function (err, objectid) {
        if (err) { throw new Meteor.Error(500, err.message); }
        console.log("Insert successful!");
    });

};

export default {
	create,
};

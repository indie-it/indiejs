Template.notificationItem.helpers({

    "getIconForAction": function(actionid) {
        const action = Lists.actions.get(actionid);
        return (action) ? action.icon : "";
    },
    "getAbsoluteUri": (actionid, route, objectid) => {
        console.log(`actionid: ${actionid}, objectid: ${objectid}`);
        if (!route || !objectid){
            return "#";
        }
        var path = Utils.pathFor(route, { '_id': objectid }).replace(/^\/|\/$/, "");
        var absolute = Meteor.absoluteUrl().replace(/^\/|\/$/, "");
        return `${absolute}/${path}`;
    },

});

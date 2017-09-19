Template.notificationItem.helpers({

    "getIconForAction": function(actionid) {
        const action = Lists.actions.get(actionid);
        return (action) ? action.icon : "";
    },
    "getAbsoluteUri": (actionid, route, objectid) => {
        if (!route || !objectid){
            return "#";
        }
        // var path = Utils.pathFor(route, { '_id': objectid }).replace(/^\/|\/$/, "");
        // var absolute = Meteor.absoluteUrl().replace(/^\/|\/$/, "");
        // return `${absolute}/${path}`;
        var options = new Spacebars.kw({
            route: route,
            query: this.query,
            data: { '_id': objectid },
        });
        return Blaze._globalHelpers.urlFor(options);
    },

});


Template.notificationItem.events({
    "click a": function(event, template) {
        console.log(template.data);

        if (!event.currentTarget.id) {
            return;
        }

        const id = event.currentTarget.id;
        event.preventDefault();
        Meteor.call('notification.markAsRead', id, (error, response) => {
            if (error) {
                sAlert.error(error.reason);
                return;
            }

            if (!template.data.action) { return; }

            // pas d'erreur; on se dirige vers le lien ciblé
            var path = Utils.pathFor(template.data.action.route, { '_id': template.data.objectid });
            console.log(path);
            Router.go(path);
        });
    }
});

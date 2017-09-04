Template.pageCgu.helpers({
    tosNotAccepted: function() {
        console.log(this.tosAccepted);
        return !this.tosAccepted;
    },
    getTosDate: function() {
        return moment(this.tosInfo.date).fromNow();
    },
})


Template.validateCgu.events({
    "click #validateCgu": function(event, template) {
        Meteor.call("tos.accept", function (err, res) {
            if (err) {
                console.error(err);
                sAlert.error("error", err.message);
                return;
            }
            sAlert.success("Conditions d'utilisation acceptées", { onRouteClose: false });
        });
    }
});

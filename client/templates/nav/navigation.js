
Template.navigation.helpers({
    "getNavigationSubTemplate": function() {
        const helpers = Blaze._globalHelpers;
        if (!Meteor.userId()) {
            return "navigationNotConnected";
        }
        if (helpers.isAdmin()) {
            return "navigationAdmin";
        }
        if (helpers.isFreelancer()) {
            return "navigationFreelancer";
        }
        return "navigationRecruiter";
    },
});

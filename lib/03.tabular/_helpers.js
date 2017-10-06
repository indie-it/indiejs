
Meteor.users.helpers({

    hasFreelanceProfile() {
        console.log("[Meteor.users.helpers] hasFreelanceProfile()");
        let profile = FreelanceProfile.findOne({ 'userid': this._id });
        return profile ? 1 : 0;
    },

    freelanceProfile() {
        console.log("[Meteor.users.helpers] freelanceProfile()");
        return FreelanceProfile.findOne({ 'userid': this._id });
    },


    hasCompanyProfile() {
        console.log("[Meteor.users.helpers] hasCompanyProfile()");
        let profile = Companies.findOne({ 'userid': this._id });
        return profile ? 1 : 0;
    },

    companyProfile() {
        console.log("[Meteor.users.helpers] companyProfile()");
        return Companies.findOne({ 'userid': this._id });
    },



});

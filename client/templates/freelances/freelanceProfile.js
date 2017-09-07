if (Meteor.isServer) { return; }

import changeCase from 'change-case';

Template['freelance-profile'].helpers({
	'getCountEducation': function () {
		return !this.doc.education ? 0 : this.doc.education.length;
	},
	'getCountExperiences': function () {
		return !this.doc.experience ? 0 : this.doc.experience.length;
	},
	'getCountSkills': function () {
		return !this.doc.skills ? 0 : this.doc.skills.length;
	},
	'getCountRecommendations': function () {
		return !this.doc.recommendations ? 0 : this.doc.recommendations.length;
	},
	'getCountFriends': function () {
		return !this.doc.friends ? 0 : this.doc.friends.length;
	},
	'getSectionIdFromExperience': function (experience) {
		var title = this.title.replace(/[^\w]/g, '').toLowerCase();
		var company = this.company.replace(/[^\w]/g, '').toLowerCase();
		var start = moment(this.start).format('YYYYMMDD');
		var id = title + "-" + company + "-" + start;

		return "experience-" + id;
	},
	'getProfilePicSrc': function () {
		if (!this.doc.photo) {
			return "/img/profile-pic-placeholder.png";
		}
		return this.doc.photo.secureUrl;
	},
	"getIsEmailVerified": function () {
		if (!this.account || !this.account.emails || this.account.emails.length == 0) {
			return false;
		}
		return this.account.emails[0].verified;
	},
	"hasSkills": function () {
		return (this.doc.skills && this.doc.skills.length > 0) ? true : false;
	},
	"hasEducation": function () {
		return (this.doc.education && this.doc.education.length > 0) ? true : false;
	},
	"hasExperiences": function () {
		return (this.doc.experience && this.doc.experience.length > 0) ? true : false;
	},
	"getSortedExperiences": function () {
		return _.sortBy(this.doc.experience, 'start').reverse();
	},
	"getSortedEducation": function () {
		return _.sortBy(this.doc.education, 'date').reverse();
	},
	"getSortedSkills": function () {
		if (!this.doc.skills) return;
		return _.sortBy(this.doc.skills, 'name');
	},
});

function configureAfix() {
	$('#nav').affix({
		offset: {
			top: $('#nav').offset().top
		}
	});
	$('#nav').affix({
		offset: {
			bottom: ($('footer').outerHeight(true) +
				$('.application').outerHeight(true)) +
			40
		}
	});
	$('body').scrollspy({
		target: '.scrollspy'
	});
};

Template['freelance-profile'].rendered = function () {
	configureAfix();
};


Template.freelanceHeader.helpers({
	"canEditProfile": function () {
		var isSelfProfile = this.doc.userid === Meteor.userId();
		var isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
		var canEdit = (isAdmin === true) || (isSelfProfile === true);

		console.log(`isSelfProfile: ${isSelfProfile}, isAdmin: ${isAdmin}, canEdit: ${canEdit}`);

		return canEdit;
	},
	"getProfileEmail": function () {
		if (!this.account || !this.account.emails || this.account.emails.length == 0) {
			return false;
		}
		return this.account.emails[0].address;
	},
	"showPersonalInfo": function () {
		return false;
	},
});

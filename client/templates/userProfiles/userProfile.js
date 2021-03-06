if (Meteor.isServer) { return; }

import changeCase from 'change-case';

Template.profile.helpers({
	'getCountEducation': function () {
		return !this.profile.education ? 0 : this.profile.education.length;
	},
	'getCountExperiences': function () {
		return !this.profile.experiences ? 0 : this.profile.experiences.length;
	},
	'getCountSkills': function () {
		return !this.profile.skills ? 0 : this.profile.skills.length;
	},
	'getCountRecommendations': function () {
		return !this.profile.recommendations ? 0 : this.profile.recommendations.length;
	},
	'getCountFriends': function () {
		return !this.profile.friends ? 0 : this.profile.friends.length;
	},
	'getSectionIdFromExperience': function (experience) {
		var title = this.title.replace(/[^\w]/g, '').toLowerCase();
		var company = this.company.replace(/[^\w]/g, '').toLowerCase();
		var start = moment(this.start).format('YYYYMMDD');
		var id = title + "-" + company + "-" + start;

		return "experience-" + id;
	},
	'getProfilePicSrc': function () {
		if (!this.profile.profilePic) {
			return "/img/profile-pic-placeholder.png";
		}
		return this.profile.profilePic.secureUrl;
	},
	"getIsEmailVerified": function () {
		if (!this.account || !this.account.emails || this.account.emails.length == 0) {
			return false;
		}
		return this.account.emails[0].verified;
	},
	"hasSkills": function () {
		return (this.profile.skills && this.profile.skills.length > 0) ? true : false;
	},
	"hasEducation": function () {
		return (this.profile.education && this.profile.education.length > 0) ? true : false;
	},
	"hasExperiences": function () {
		return (this.profile.experiences && this.profile.experiences.length > 0) ? true : false;
	},
	"getSortedExperiences": function () {
		return _.sortBy(this.profile.experiences, 'start').reverse();
	},
	"getSortedEducation": function () {
		return _.sortBy(this.profile.education, 'date').reverse();
	},
	"getSortedSkills": function () {
		if (!this.profile.skills) return;
		return _.sortBy(this.profile.skills, 'name');
	},
});

function drawChart() {
	if (!Router) return;
	if (Router.current().url.indexOf("profile/view") === -1) {
		console.log("Router: incorrect route for drawChart function");
		return;
	}

	// récupération du profil
	var data = Router.current().data();
	var profile = data.profile;

	// on transforme les 'skills' de notre profil
	// pour pouvoir les afficher sous forme de radar.
	var names = [];
	var levels = [];
	_.each(profile.skills, function (skill) {
		names.push(skill.name);
		// on multiple par 2 car la note est sur 10.
		levels.push(skill.level * 2);
	});

	var radarChartData = {
		labels: names, // ["ATT", "SPD", "POW", "DEF", "STA", "TEC"],
		datasets: [{
			scaleOverride: true,
			scaleSteps: 5,
			scaleStepWidth: 5,
			scaleStartValue: 0,
			pointLabelFontSize: 16,
			fillColor: "rgba(0,120,0,0.2)",
			strokeColor: "rgba(0,120,0,1)",
			pointColor: "rgba(10,10,10,1)",
			pointStrokeColor: "#bbb",
			pointHighlightFill: "#333",
			pointHighlightStroke: "rgba(255,255,0,1)",
			data: levels //[12, 15, 17, 16, 11, 13]
		}]
	};
	var ctx = $("#radar").get(0).getContext("2d");

	var myRadar = new Chart(ctx)
		.Radar(radarChartData, {
			responsive: false,
			pointDot: false,
			showTooltips: false,
			scaleOverride: true,
			scaleSteps: 4,
			scaleStepWidth: 5,
			scaleStartValue: 0
		});
}
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

Template.profile.rendered = function () {
	configureAfix();
	//Tracker.autorun(drawChart);
};


Template.profileHeader.helpers({
	"canEditProfile": function () {
		var isSelfProfile = this.profile.userid === Meteor.userId();
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
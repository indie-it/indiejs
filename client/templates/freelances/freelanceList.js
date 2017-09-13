import escapeStringRegexp from 'escape-string-regexp';

let fetchAllSkills = (template) => {
	Meteor.call('freelance.getAllSkills', null, (error, response) => {
		if ( error ) {
			sAlert.error(error.reason);
			return;
		}
		template.allSkills.set(response);
	});
};

Template['freelance-list'].onCreated(() => {
	let template = Template.instance();

	// init
	template.allSkills = new ReactiveVar();
	template.skillsFilter = new ReactiveVar();
	template.filterIsVisible = new ReactiveVar();

	// affectation d'une valeur par défaut
	template.filterIsVisible.set(false);

	// should be an array of String
	template.subscribe("freelance.getAllSkills");
});
Template['freelance-list'].onRendered( () => {
	fetchAllSkills(Template.instance());
});

Template['freelance-list'].helpers({
	getAllSkills() {
		return Template.instance().allSkills.get();
	},
	getSkillFilter() {
		return Template.instance().skillsFilter.get();
	},
	selector() {
		var skill = Template.instance().skillsFilter.get();
		if (skill) {
			const regexStr = `^${escapeStringRegexp(skill)}$`
			// console.log(regexStr);
			var regexObj = { $regex: regexStr, $options: "i"};
			return { "skills": { $elemMatch: { "name": regexObj } } };
		}
		return {};
	},
	getClassForSkillFilter(id) {
		var currentFilter = Template.instance().skillsFilter.get();
		return (currentFilter && currentFilter === id) ? "active" : "";
	},
});

Template['freelance-list'].events({
	'click li a': (event) => {
		Template.instance().skillsFilter.set(event.currentTarget.id);
	},
	'click #close-filter': (event) => {
		Template.instance().skillsFilter.set();
	},
	'click #toggle-filter':(event) => {
		var template = Template.instance();
		var filterIsVisible = template.filterIsVisible.get();
		if (filterIsVisible === false) {
			$('#nav-skills').show();
		}else{
			$('#nav-skills').hide();
		}
		template.filterIsVisible.set(!filterIsVisible);
	},
});

Template.singleFreelanceDisplay.helpers({
	'hasSkills': () => {
        var data = Template.instance().data;
		if (!data.skills) { return false; }
		return data.skills.length > 0;
	},
    'getFreelanceTitle':() => {
        var data = Template.instance().data;
        return `${data.contact.firstName} ${data.contact.lastName} - ${data.profile.title}`;
    }
});

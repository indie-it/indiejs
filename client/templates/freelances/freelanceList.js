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

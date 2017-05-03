Template.freelancerDisplay.helpers({
	"hasSkills": function () {
		if (!this.skills)
			return false;
		return this.skills.length > 0;
	},
	//"getShortenDescription": function () {
	//	if (!this.description){
	//		return "";
	//	}
	//	return 
	//},
});
Template.experience.helpers({

	getDuration: function() {
		var end = !!this.isCurrent ? new Date() : this.end;

		var mStartDate = moment([this.start.getFullYear(), this.start.getMonth(), this.start.getDate()]);
		var mTermDate = moment([end.getFullYear(), end.getMonth(), end.getDate()]);

		// Days
		var daysDiff = mTermDate.diff(mStartDate, 'days');

		var duration = moment.duration(daysDiff, 'days');

		return duration.humanize();
	},

	getPeriode: function() {
		// console.log("getPeriode");
		if (this.isCurrent) {
			return "Depuis " + moment(this.start).format('MMMM YYYY');
		}
		return "De " + moment(this.start).format('MMMM YYYY') + " à " + moment(this.end).format('MMMM YYYY');
	},

});

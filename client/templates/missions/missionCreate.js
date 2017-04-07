Template.missionCreate.helpers({
	create: function() {
		console.log("create");
	},
	rendered: function() {
		console.log("rendered");
		// $('input').datepicker({
		// 	autoclose: true,
		// 	todayHighlight: true
		// });
	},
	destroyed: function() {
		console.log("destroyed");
	},
});
//
// Template.missionCreate.events({
//
//     "lick #foo": function(event, template){
//
//     }
//
// });

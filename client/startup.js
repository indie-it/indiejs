//import dataTablesBootstrap from 'datatables.net-bs';
//import 'datatables.net-bs/css/dataTables.bootstrap.css';

//dataTablesBootstrap(window, $);

Meteor.startup(function () {

	//configuration sAlert
	sAlert.config({
		effect: '',
		position: 'top-left',
		timeout: 3500,
		html: false,
		onRouteClose: true,
		stack: false,
		// or you can pass an object:
		// stack: {
		//     spacing: 10 // in px
		//     limit: 3 // when fourth alert appears all previous ones are cleared
		// }
		offset: 50, // in px - will be added to first alert (bottom or top - depends of the position in config)
		beep: false,
		// examples:
		// beep: '/beep.mp3'  // or you can pass an object:
		// beep: {
		//     info: '/beep-info.mp3',
		//     error: '/beep-error.mp3',
		//     success: '/beep-success.mp3',
		//     warning: '/beep-warning.mp3'
		// }
		onClose: _.noop //
		// examples:
		// onClose: function() {
		//     /* Code here will be executed once the alert closes. */
		// }
	});


	// async loader for fonts
	// https://github.com/typekit/webfontloader
	WebFontConfig = {
		google: {
			families: [
				'Fira+Sans:200',
				'Lobster',
				'Pacifico',
				'Baloo',
				//'Fira+Sans:500',
				//'Roboto Slab:700,400:latin',
				//'Oswald:400',
				//'Mouse Memoirs'
			]
		}
	};
	(function () {
		var wf = document.createElement('script');
		wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
			'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
		wf.type = 'text/javascript';
		wf.async = 'true';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(wf, s);
		//console.log("async fonts loaded", WebFontConfig);
	})();



	AutoForm.addInputType("tos-checkbox", {
		template: "afTosCheckbox",
		valueOut: function () {
			return !!this.is(":checked");
		},
		valueConverters: {
			"string": AutoForm.valueConverters.booleanToString,
			"stringArray": AutoForm.valueConverters.booleanToStringArray,
			"number": AutoForm.valueConverters.booleanToNumber,
			"numberArray": AutoForm.valueConverters.booleanToNumberArray
		},
		contextAdjust: function (context) {
			if (context.value === true) {
				context.atts.checked = "";
			}
			//don't add required attribute to checkboxes because some browsers assume that to mean that it must be checked, which is not what we mean by "required"
			delete context.atts.required;
			return context;
		}
	});
});

import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';



// Liste des indépendants 2
new Tabular.Table({
	name: "FreelanceList",
	collection: FreelanceProfile,
	pub: "freelance.getTabular",
	columns: [
		// 0 : userid
		{
			data: "userid",
			title: "Profil",
			tmpl: Meteor.isClient && Template.singleFreelanceDisplay,
			autoWidth: true,
		},

		// 1 : availDate
		{
			data: "profile.availDate",
			title: "Disponibilité",
			width: 90,
			render: (data, type, doc) => {
				console.log(doc);;
				if (doc.isAvailable) {
					return "Oui";
				}
				if (data) {
					if (data < new Date) {
						return "Oui";
					}
					return Utils.formatDate(data);
				}
			}
		},

		// 2 - updated
		{
			data: "updated",
			title: "Mise à jour",
			render: function (val, type, doc) {
				return Utils.formatDate(val);
			},
			width: 80,
		},

		//colonnes cachées
		// 3 - contact
		{
			data: "contact",
			visible: false,
		},

		// 5 - isAvailable
		{
			data: "profile.isAvailable",
			title: "Dispo. réelle",
			visible: false,
		},
		// 6 - title
		{
			data: "profile.title",
			visible: false,
		},

		// 7 - skills
		{
			data: "skills",
			visible: false,
		},

	],
	stateSave: true,
	responsive: true,
	autoWidth: true,
	order: [[1, 'asc']],
	language: Globals.tabular.language,
	paging: true,
});

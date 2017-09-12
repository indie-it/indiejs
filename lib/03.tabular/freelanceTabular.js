import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';



// Liste des indépendants 2
new Tabular.Table({
	name: "FreelanceList",
	collection: FreelanceProfile,
	//pub: "freelance.getTabular",
	// selector() {
	// 	console.log("tabular.selector called!");
	// 	var filter = { "skills.name" : { $in: ["c#"] } };
	// 	console.log(filter);
	// 	return filter ? filter : {};
	// },
	changeSelector(selector, userId) {
		console.log("tabular.changeSelector called!");
		console.log(selector);
		return selector;
	},
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
				if (doc.profile.isAvailable) {
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
	// searching: false,
	info: false,
	autoWidth: true,
	order: [[1, 'asc']],
	language: Globals.tabular.language,
	paging: true,
});



// affectation d'un indépendant dans la page mission
// Profils utilisateur
new Tabular.Table({
	name: "FreelanceListForMission",
	collection: FreelanceProfile,
	columns: [
		{
			data: "userid",
			tmpl: Meteor.isClient && Template.assignUser,
			width: 70
		},
		{
			data: "contact.lastName",
			title: "Nom",
		},
		{
			data: "contact.firstName",
			title: "Prénom",
		},
		// disponibilité : "oui" ou date de dispo
		{
			data: "profile.availDate",
			title: "Disponibilité",
			width: 90,
			render: (data, type, doc) => {
				if (doc.profile.isAvailable) {
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
		{
			data: "updated",
			title: "Date de m.à.j.",
			render: function (val, type, doc) {

				return !val ? "" : Utils.formatDate(val);
			}
		},
		{
			data: "profile",
			title: "Dispo. réelle",
			visible: false,
		},
	],
	stateSave: true,
	responsive: true,
	autoWidth: false,
	order: [[2, 'desc']],
	language: Globals.tabular.language,
});

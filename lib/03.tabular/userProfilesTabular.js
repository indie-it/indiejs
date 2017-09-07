import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// Profils utilisateur
new Tabular.Table({
	name: "UserProfiles",
	collection: UserProfiles,
	columns: [
		{
			data: "userid",
			tmpl: Meteor.isClient && Template.assignUser,
			width: 70
		},
		{
			data: "lastName",
			title: "Nom",
		},
		{
			data: "firstName",
			title: "Prénom",
		},
		{
			data: "updated",
			title: "Date de m.à.j.",
			render: function (val, type, doc) {
				return Utils.formatDate(val);
			}
		},
	],
	stateSave: true,
	responsive: true,
	autoWidth: false,
	order: [[2, 'desc']],
	language: Globals.tabular.language,
});

// Liste des indépendants
new Tabular.Table({
	name: "Freelancers",
	collection: UserProfiles,
	pub: "userprofile.getTabular",
	columns: [
		// 0 : userid
		{
			data: "userid",
			title: "Profil",
			tmpl: Meteor.isClient && Template.freelancerDisplay,
			autoWidth: true,
		},

		// 1 : availDate
		{
			data: "availDate",
			title: "Disponibilité",
			width: 90,
			render: (data, type, doc) => {
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
		// 3 - firstName
		{
			data: "firstName",
			visible: false,
		},

		// 4 - lastName
		{
			data: "lastName",
			visible: false,
		},

		// 5 - isAvailable
		{
			data: "isAvailable",
			title: "Dispo. réelle",
			visible: false,
		},
		// 6 - title
		{
			data: "title",
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

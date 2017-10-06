import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


// Liste des indépendants 2
new Tabular.Table({
	name: "FreelanceList",
	collection: FreelanceProfile,
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
// FreelanceListForMission
new Tabular.Table({
	name: "FreelanceListForMission",
	collection: FreelanceProfile,
	allow(userId) {
		// check for admin role with alanning:roles package
		return Roles.userIsInRole(userId, 'admin');
	},
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


// Liste des utilisateurs
// AdminUsersList
new Tabular.Table({
	name: "AdminUsersList",
	collection: Meteor.users,

	allow(userId) {
		// check for admin role with alanning:roles package
	    return Roles.userIsInRole(userId, 'admin');
	},
	columns: [
		{
			data: "_id",
			title: "Id",
			visible: false,
		},
		{
			data: "username",
			title: "Nom d'utilisateur",
			visible: true,
		},
		{
			data: "emails[0].address",
			title: "Adresse e-mail",
			visible: true,
		},
		{
			data: "emails[0].verified",
			title: "vérifié?",
			visible: true,
		},
		{
			data: "roles[0]",
			title: "Rôle"
		},
		{
			data: null,
			title: "test"
		},
	],
	stateSave: true,
	responsive: true,
	autoWidth: false,
	searching: true,
	info: false,
	order: [[1, 'asc']],
	language: Globals.tabular.language,
	paging: true,
});


// Liste des profils Freelances
// AdminFreelanceList
new Tabular.Table({
	name: "AdminFreelanceList",
	collection: Meteor.users,
	pub: "tabular_UserAndFreelanceProfiles",
	selector() {
		console.log("[AdminFreelanceList] tabular.selector called!");
		var filter = { "roles" : { $in: ["freelancer"] } };
		console.log(filter);
		return filter ? filter : {};
	},
	allow(userId) {
		// check for admin role with alanning:roles package
	    return Roles.userIsInRole(userId, 'admin');
	},
	columns: [
		{
			data: "_id",
			title: "Id",
			visible: false,
		},
		{
			data: "username",
			title: "Nom d'utilisateur",
			visible: true,
		},
		{
			data: "emails[0].address",
			title: "Adresse e-mail",
			visible: true,
		},
		{
			data: "emails[0].verified",
			title: "vérifié?",
			visible: true,
		},
		{
			data: "hasFreelanceProfile()",
			title: "Profil indé. créé?",
		},
		{
			data: "freelanceProfile()",
			title: "Nom",
			render: (data, type, doc) => {
				if (!data || !data.contact){
					return "";
				}
				return data.contact.lastName;
			}
		},
		{
			data: "freelanceProfile()",
			title: "Prénom",
			render: (data, type, doc) => {
				if (!data || !data.contact){
					return "";
				}
				return data.contact.firstName;
			}
		}
	],
	stateSave: true,
	responsive: true,
	autoWidth: false,
	searching: true,
	info: true,
	order: [[1, 'asc']],
	language: Globals.tabular.language,
	paging: true,
});

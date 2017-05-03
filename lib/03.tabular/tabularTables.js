import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

TabularTables = {};

// Toutes les missions
new Tabular.Table({
	name: "Missions",
	collection: Missions,
	columns: [
		{
			data: "name",
			title: "Nom",
			tmpl: Meteor.isClient && Template.missionName,
			tmplContext(rowData) {
				return {
					item: rowData,
					column: 'name'
				};
			}
		},
		{ data: "type", title: "Type" },
		{ data: "field", title: "Secteur pro." },
		{ data: "location", title: "Ville" },
		{ data: "authorName", title: "Auteur" },
		{ data: "averageDailyRate", title: "TJM" },
		{
			data: "start",
			title: "Démarrage",
			render: function (val, type, doc) {
				if (val instanceof Date) {
					return Utils.formatDate(val);
				}
			}
		},
		{
			data: "updated",
			title: "Date de m.à.j.",
			render: function (val, type, doc) {
				return Utils.formatDate(val);
			}
		},
		{ data: "currentState.step", title: "Workflow" },
	],
	stateSave: true,
	responsive: true,
	autoWidth: false,
	createdRow: function (row, data, dataIndex) {
		if (!data.currentState.step || data.currentState.step === WorkflowConst.STEP_ARCHIVED) {
			$(row).addClass('danger');
			return;
		}
		if (data.currentState.step === WorkflowConst.STEP_NEW) {
			$(row).addClass('info');
			return;
		}
		if (data.currentState.step === WorkflowConst.STEP_VALIDATED) {
			$(row).addClass('success');
			return;
		}
		if (data.currentState.step === WorkflowConst.STEP_IN_PROGRESS) {
			$(row).addClass('warning');
			return;
		}
	},
	language: Globals.tabular.language,
});

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

// Actions réalisées
new Tabular.Table({
	name: "Actions",
	collection: Actions,
	columns: [
		{
			data: "createdAt",
			title: "Date",
			render: function (val, type, doc) {
				return moment(val).format('DD/MM/YYYY HH:mm');
			},
		},
		{
			data: "actionType",
			title: "Type action",
			render: function (val, type, doc) {
				var actionObj = Lists.actions.get(val);
				if (actionObj) {
					return `${actionObj.text} (${actionObj.id})`;
				}
				return "Action introuvable";
			},
		},
		{
			data: "options",
			title: "Options",
			render: function (val, type, obj) {
				var arr = [];

				if (val.mission) { arr.push(`mission: ${val.mission}`); }
				if (val.missionid) { arr.push(`missionid: ${val.missionid}`); }
				if (val.profile) { arr.push(`profile: ${val.profile}`); }
				if (val.profileid) { arr.push(`profileid: ${val.profileid}`); }

				if (val.username) { arr.push(`username: ${val.username}`); }
				if (val.role) { arr.push(`role: ${val.role}`); }
				if (val.company) { arr.push(`company: ${val.company}`); }
				if (val.companyid) { arr.push(`companyid: ${val.companyid}`); }

				return arr.join(", ");
			},
		},
	],
	stateSave: true,
	responsive: true,
	autoWidth: true,
	order: [[0, 'desc']],
	language: Globals.tabular.language,
});

// Liste des indépendants 
new Tabular.Table({
	name: "Freelancers",
	collection: UserProfiles,
	pub: "userprofile.getTabular",
	columns: [
		{
			data: "userid",
			title: "Profil",
			tmpl: Meteor.isClient && Template.freelancerDisplay,
			autoWidth: true,
		},
		{
			data: "isAvailable",
			title: "Disponibilité",
			render: function (val, type, doc) {

				if (val === true) {
					return "Oui";
				}
				if (doc.availDate) {
					return Utils.formatDate(doc.availDate);
				}
				return "Aucune date de dispo.";
			},
			width: 90,
		},

		{
			data: "updated",
			title: "Mise à jour",
			render: function (val, type, doc) {
				return Utils.formatDate(val);
			},
			width: 80,
		},


		//colonnes cachées
		{
			data: "firstName",
			visible: false,
		},

		{
			data: "lastName",
			visible: false,
		},

		{
			data: "availDate",
			visible: false,
		},
		{
			data: "title",
			visible: false,
		},

		{
			data: "skills",
			visible: false,
		},

		{
			data: "description",
			visible: false,
		},
	],
	stateSave: true,
	responsive: true,
	autoWidth: true,
	order: [[6, 'desc']],
	language: Globals.tabular.language,
	//scrollY: '70vh',
	//scrollCollapse: true,
	paging: false, 
	limit: 500
});

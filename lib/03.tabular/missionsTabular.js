import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


// Toutes les missions
new Tabular.Table({
	name: "MissionsAdmin",
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
		{
			data: "averageDailyRate",
			title: "TJM",
			render: function (val, type, doc) {
				return Utils.getTjmText(doc);
			}
		 },
		{
			data: "start",
			title: "Démarrage",
			render: function (val, type, doc) {
				return Utils.formatDate(val);
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
		if (!data.currentState.step || data.currentState.step === Lists.missionWorkflow.map.STEP_ARCHIVED) {
			$(row).addClass('danger');
			return;
		}
		if (data.currentState.step === Lists.missionWorkflow.map.STEP_NEW) {
			$(row).addClass('info');
			return;
		}
		if (data.currentState.step === Lists.missionWorkflow.map.STEP_VALIDATED) {
			$(row).addClass('success');
			return;
		}
		if (data.currentState.step === Lists.missionWorkflow.map.STEP_IN_PROGRESS) {
			$(row).addClass('warning');
			return;
		}
	},
	language: Globals.tabular.language,
	order: [[7, 'desc']],
});

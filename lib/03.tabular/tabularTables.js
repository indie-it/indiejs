import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

TabularTables = {};

//Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

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
		{ data: "currentState", title: "Workflow" },
	],
	stateSave: true,
	responsive: true,
	autoWidth: false,
	createdRow: function (row, data, dataIndex) {
		if (!data.currentState || data.currentState === 'archived') {
			$(row).addClass('danger');
			return;
		}
		if (data.currentState === 'new') {
			$(row).addClass('info');
			return;
		}
		if (data.currentState === 'validated') {
			$(row).addClass('success');
			return;
		}
		if (data.currentState === 'in-progress') {
			$(row).addClass('warning');
			return;
		}
	}
});


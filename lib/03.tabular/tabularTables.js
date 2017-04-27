import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

TabularTables = {};

//Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

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
            render: function(val, type, doc) {
                if (val instanceof Date) {
                    return Utils.formatDate(val);
                }
            }
        },
        {
            data: "updated",
            title: "Date de m.à.j.",
            render: function(val, type, doc) {
                return Utils.formatDate(val);
            }
        },
        { data: "currentState.step", title: "Workflow" },
    ],
    stateSave: true,
    responsive: true,
    autoWidth: false,
    createdRow: function(row, data, dataIndex) {
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
            render: function(val, type, doc) {
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
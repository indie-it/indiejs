import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';



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

				if (!val) { return ""; }

				try {
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
				}catch(err){
					console.log(err.message);
				}

			},
		},
	],
	stateSave: true,
	responsive: true,
	autoWidth: true,
	order: [[0, 'desc']],
	language: Globals.tabular.language,
});

import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


// Liste des profils Freelances
// AdminFreelanceList
new Tabular.Table({
	name: "AdminCompanyList",
	collection: Meteor.users,
	pub: "tabular_UserAndCompanyProfiles",
	selector() {
		console.log("[AdminCompanyList] tabular.selector called!");
		var filter = { "roles" : { $in: [ "recruiter" ] } };
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
			data: "hasCompanyProfile()",
			title: "Profil ent. créé?",
		},
		{
			data: "companyProfile()",
			title: "Nom entreprise",
			render: (data, type, doc) => {
				if (!data){
					return "";
				}
				return data.name;
			}
		},
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

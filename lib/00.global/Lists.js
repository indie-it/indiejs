import SimpleSchema from 'simpl-schema';
import changeCase from 'change-case';

Lists = {};


// actions possibles
Lists.actions = {};
Lists.actions.schema = new SimpleSchema({
	'id': String,
	'text': String,
	'title': { type: String, optional: true },
	'subtitle': { type: String, optional: true },
});
Lists.actions.values = [

	// utilisateurs
	{ id: 'user-create', text: "Création d'utilisateur", },
	{ id: 'user-log-in', text: "Connexion utilisateur", },
	{ id: 'user-log-off', text: "Déconnexion utilisateur", },

	// candidatures
	{
		id: 'user-interested',
		text: "Candidature d'un utilisateur",
		title: 'Candidature sur Indie IT',
		subtitle: "Un utilisateur vient de postuler sur Indie IT",
	},
	{
		id: 'user-not-interested',
		text: "Utilisateur non intéressé par une mission",
	},

	// profils
	{
		id: 'profile-freelancer-create',
		text: "Création de profil 'indépendant'",
		title: 'Nouveau profil indépendant créé sur Indie IT',
		subtitle: "Un nouveau profil indépendant vient d'être créé sur Indie IT",
	},
	{
		id: 'profile-freelancer-update',
		text: "Mise à jour de profil 'indépendant'",
		title: 'Profil indépendant mis à jour sur Indie IT',
		subtitle: "Un profil indépendant vient d'être mis à jour sur Indie IT",
	},
	{
		id: 'profile-recruiter-create',
		text: "Création de profil 'Entreprise'",
		title: 'Nouveau profil recruteur créé sur Indie IT',
		subtitle: "Un nouveau profil recruteur vient d'être créé sur Indie IT",
	},
	{
		id: 'profile-recruiter-update',
		text: "Mise à jour de profil 'Entreprise'",
		title: 'Profil recruteur mis à jour sur Indie IT',
		subtitle: "Un profil recruteur vient d'être mis à jour sur Indie IT",
	},

	// missions
	{
		id: 'mission-create',
		text: "Création de mission",
		title: "Nouvelle mission sur Indie IT",
		subtitle: "Une nouvelle mission vient d'arriver sur le réseau",
	},
	{
		id: 'mission-update',
		text: "Mise à jour de mission",
		title: 'Mission mise à jour sur Indie IT',
		subtitle: "Une mission vient d'être mise à jour sur Indie IT",
	},
	{
		id: 'mission-validate',
		text: "Validation de mission",
		title: "Mission validée sur Indie IT",
		subtitle: "Une mission vient d'être validée sur Indie IT",
	},
	{
		id: 'mission-archive',
		text: "Archivage de mission",
		title: "Mission archivée sur Indie IT",
		subtitle: "Une mission vient d'être archivée sur Indie IT",
	},
	{
		id: 'mission-unarchive',
		text: "Désarchivage de mission",
		title: "Mission déterrée sur Indie IT",
		subtitle: "Une mission vient d'être déterrée sur Indie IT",
	},
	{
		id: 'mission-accept',
		text: "Affectation de mission",
		title: "Mission affectée sur Indie IT",
		subtitle: "Une mission vient d'être affectée sur Indie IT",
	},

	//invitations 
	{
		id: 'invite-create',
		text: "Nouvelle invitation",
	},
	{
		id: 'invite-accept',
		text: "L'invitation a été acceptée",
	},
];
Lists.actions.ids = _.map(Lists.actions.values, (obj) => { return obj.id; });
Lists.actions.map = _.object(_.map(Lists.actions.values, (item) => { return [changeCase.camelCase(item.id), item.id]; }));
Lists.actions.get = (id) => { return _.findWhere(Lists.actions.values, { 'id': id }); };


// Catégories
Lists.categories = {};
Lists.categories.values = [
	{ id: 'dev', text: "Développement", },
	{ id: 'gestion-proj', text: "Gestion de projet", },
	{ id: 'admin-bdd', text: "Admin. Base de données", },
];
Lists.categories.ids = _.map(Lists.categories.values, (obj) => { return obj.id; });
Lists.categories.map = _.object(_.map(Lists.categories.values, (item) => { return [changeCase.camelCase(item.id), item.id]; }));
Lists.categories.get = (id) => { return _.findWhere(Lists.categories.values, { 'id': id }); };
Lists.categories.dropdownValues = _.map(Lists.categories.values, (obj) => { return { value: obj.text, label: obj.text }; });


// Tailles d'entreprises
Lists.companySizes = {};
Lists.companySizes.values = [
	{ id: 'micro', name: "Micro-entreprise", text: "moins de 10 salariés" },
	{ id: 'pme', name: "PME", text: "moins de 250 employés" },
	{ id: 'eti', name: "ETI", text: "Entreprise de taille intermédiaire" },
	{ id: 'gde', name: "Grande Enterprise", text: "Grande enterprise" },
];
Lists.companySizes.ids = _.map(Lists.companySizes.values, (obj) => { return obj.id; });
Lists.companySizes.dropdownValues = _.map(Lists.companySizes.values, (obj) => { return { value: obj.id, label: obj.name }; });
Lists.companySizes.get = (companySizeId) => { return _.findWhere(Lists.companySizes.values, { id: companySizeId }); };


// Types d'entreprise
Lists.companyTypes = {};
Lists.companyTypes.values = [
	{ id: 'private', name: "Entreprise privée" },
	{ id: 'public', name: "Entreprise publique" },
];
Lists.companyTypes.ids = _.map(Lists.companyTypes.values, (obj) => { return obj.id; });
Lists.companyTypes.dropdownValues = _.map(Lists.companyTypes.values, (obj) => { return { value: obj.id, label: obj.name }; });
Lists.companyTypes.get = (companyTypeId) => { return _.findWhere(Lists.companyTypes.values, { id: companyTypeId }); };


Lists.missionWorkflow = {};
Lists.missionWorkflow.values = [
	{
		id: 'new',
		code: 'STEP_NEW',
		text: "Nouvelle mission",
		tooltip: "La mission a été créée récemment et n'a pas encore été validée",
		icon: 'fa-flash',
		classname: 'label-default',
	},
	{
		id: 'validated',
		code: 'STEP_VALIDATED',
		text: "Mission validée",
		tooltip: "La mission a été validée par Indie IT",
		icon: 'fa-certificate',
		classname: 'label-success',
	},
	{
		id: 'in-progress',
		code: 'STEP_IN_PROGRESS',
		text: "Mission affectée",
		tooltip: "La mission est affectée à un indépendant du réseau",
		icon: 'fa-black-tie',
		classname: 'label-primary',
	},
	{
		id: 'archived',
		code: 'STEP_ARCHIVED',
		text: "Mission archivée",
		tooltip: "La mission est archivée",
		icon: 'fa-archive',
		classname: 'label-danger',
	},
];
Lists.missionWorkflow.ids = _.map(Lists.missionWorkflow.values, (obj) => { return obj.id; });
Lists.missionWorkflow.map = _.object(_.map(Lists.missionWorkflow.values, (item) => { return [item.code, item.id]; }));
Lists.missionWorkflow.get = (missionId) => { return _.findWhere(Lists.missionWorkflow.values, { id: missionId }); };


Lists.roles = {};
Lists.roles.values = [
	{ id: 'admin', text: "Administrateur" },
	{ id: 'freelancer', text: "Indépendant" },
	{ id: 'recruiter', text: "Recruteur" },
];
Lists.roles.ids = _.map(Lists.roles.values, (obj) => { return obj.id; });
Lists.roles.map = _.object(_.map(Lists.roles.values, (item) => { return [changeCase.camelCase(item.id), item.id]; }));
Lists.roles.get = (roleId) => { return _.findWhere(Lists.roles.values, { id: roleId }); };


// niveau d'études et technologies.
Lists.educationLevels = [];
Lists.technos = [];

var educationLevels = [
	"Baccalauréat",
	"Bac+1",
	"Bac+2",
	"Bac+3",
	"Bac+4",
	"Bac+5",
	"Diplôme d'ingénieur",
	"Master",
	"Doctorat",
];
var technos = [
	".net",
	"vb.net",
	"AutoMapper",
	"asp.net",
	"c",
	"c++",
	"c#",
	"vb",
	"Entity Framework",
	"Git",
	"Java J2EE",
	"JavaScript",
	"Mercurial",
	"MongoDB",
	"NHibernate",
	"Neo4j",
	"Ninject",
	"php",
	"SQL Server",
	"Symphony",
	"TFS",
	"WinForms",
	"WPF",
	"ADO.NET",
	"Visual Studio",
	"Infragistics WPF",
	"iTextSharp",
	"TimePeriodLibrary (c#)",
	"AngularJS",
	"ReactJS",
	"NodeJS",
	"Meteor",
	"Spring",
	"Project Server",
];
var pushItemTo = (arrayToPushValuesTo, arrayToGetValuesFrom) => {
	_.each(arrayToGetValuesFrom, (item) => {
		arrayToPushValuesTo.push({
			value: item,
			label: item
		});
	});
}
pushItemTo(Lists.educationLevels, educationLevels);
pushItemTo(Lists.technos, technos);

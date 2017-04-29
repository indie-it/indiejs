import changeCase from 'change-case';

Lists = {};

Lists.educationLevels = [];
Lists.technos = [];
Lists.categories = [];

// actions possibles
Lists.actions = {};
Lists.actions.values = [
	{ id: 'user-create', text: "Création d'utilisateur", },
	{ id: 'user-log-in', text: "Connexion utilisateur", },
	{ id: 'user-log-off', text: "Déconnexion utilisateur", },
	{ id: 'user-interested', text: "Utilisateur intéressé par une mission", },
	{ id: 'user-not-interested', text: "Utilisateur non intéressé par une mission", },
	{ id: 'profile-freelancer-create', text: "Création de profil 'indépendant'", },
	{ id: 'profile-freelancer-update', text: "Mise à jour de profil 'indépendant'", },
	{ id: 'profile-recruiter-create', text: "Création de profil 'Entreprise'", },
	{ id: 'profile-recruiter-update', text: "Mise à jour de profil 'Entreprise'", },
	{ id: 'mission-create', text: "Création de mission", },
	{ id: 'mission-update', text: "Mise à jour de mission", },
	{ id: 'mission-validate', text: "Validation de mission", },
	{ id: 'mission-archive', text: "Archivage de mission", },
	{ id: 'mission-accept', text: "Affectation de mission", },
];
Lists.actions.ids = _.map(Lists.actions.values, function (obj) { return obj.id; });
Lists.actions.map = _.object(_.map(Lists.actions.values, function (item) { return [changeCase.camelCase(item.id, ), item.id]; }));
Lists.actions.get = function (id) { return _.findWhere(Lists.actions.values, { 'id': id }); };


// catégories, niveau d'études et technologies.
var categories = [
	"Développement web",
	"Création de site web",
	"Développement applicatif",
	"Gestion de projet",
	"Admin/Base de données",
];
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

var pushItemTo = function (arrayToPushValuesTo, arrayToGetValuesFrom) {
	_.each(arrayToGetValuesFrom, function (item) {
		arrayToPushValuesTo.push({
			value: item,
			label: item
		});
	});
}

pushItemTo(Lists.educationLevels, educationLevels);
pushItemTo(Lists.technos, technos);
pushItemTo(Lists.categories, categories);

// Tailles d'entreprises
Lists.companySizes = {};
Lists.companySizes.values = [
	{ id: 'micro', name: "Micro-entreprise", text: "moins de 10 salariés" },
	{ id: 'pme', name: "PME", text: "moins de 250 employés" },
	{ id: 'eti', name: "ETI", text: "Entreprise de taille intermédiaire" },
	{ id: 'gde', name: "Grande Enterprise", text: "Grande enterprise" },
];
Lists.companySizes.ids = _.map(Lists.companySizes.values, function (obj) { return obj.id; });
Lists.companySizes.dropdownValues = _.map(Lists.companySizes.values, function (obj) { return { value: obj.id, label: obj.name }; });
Lists.companySizes.get = function (companySizeId) { return _.findWhere(Lists.companySizes.values, { id: companySizeId }); };

Lists.companyTypes = {};
Lists.companyTypes.values = [
	{ id: 'private', name: "Entreprise privée" },
	{ id: 'public', name: "Entreprise publique" },
];
Lists.companyTypes.ids = _.map(Lists.companyTypes.values, function (obj) { return obj.id; });
Lists.companyTypes.dropdownValues = _.map(Lists.companyTypes.values, function (obj) { return { value: obj.id, label: obj.name }; });
Lists.companyTypes.get = function (companyTypeId) { return _.findWhere(Lists.companyTypes.values, { id: companyTypeId }); };

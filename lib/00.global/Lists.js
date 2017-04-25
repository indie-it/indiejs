Lists = {};

Lists.educationLevels = [];
Lists.technos = [];
Lists.categories = [];

Lists.actionsIds = [
	"profile-create",
	"profile-update",
	"mission-create",
	"mission-update",
	"user-sign-in",
	"user-interested",
	"user-not-interested",
	"user-log-in",
	"user-log-off",

	'mission-validate',
	'mission-archive',
	'mission-accept',
];
Lists.profileTypes = [
	"admin",
	"freelancer",
	"recruiter",
];

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


Lists.companySizes = {};
Lists.companySizes.values = [
	{ id: 'micro', name: "Micro-entreprise", text: "Micro-entreprise (moins de 10 salariés)" },
	{ id: 'pme', name: "PME", text: "Petite et moyenne entreprise (moins de 250 employés)" },
	{ id: 'eti', name: "ETI", text: "Entreprise de taille intermédiaire" },
	{ id: 'gde', name: "Grande Enterprise", text: "Grande enterprise" },
];
Lists.companySizes.ids = _.map(Lists.companySizes.values, function (obj) { return obj.id; });
Lists.companySizes.dropdownValues = _.map(Lists.companySizes.values, function (obj) { return { value: obj.id, label: obj.name }; });


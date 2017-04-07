Lists = {};

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
	"Master"
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

var pushItemTo = function(arrayToPushValuesTo, arrayToGetValuesFrom) {
	_.each(arrayToGetValuesFrom, function(item) {
		arrayToPushValuesTo.push({
			value: item,
			label: item
		});
	});
}

pushItemTo(Lists.educationLevels, educationLevels);
pushItemTo(Lists.technos, technos);

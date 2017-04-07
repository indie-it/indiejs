// var technos = Technos.find().count();
// console.log("technos = " + technos);
//
// var technos = [{
// 	name: 'C#'
// }, {
// 	name: 'asp.net'
// }, {
// 	name: '.net'
// }, {
// 	name: 'Entity Framework'
// }, {
// 	name: 'NHibernate'
// }, {
// 	name: 'AutoMapper'
// }, {
// 	name: 'Ninject'
// }, {
// 	name: 'SQL Server'
// }];
//
// _.each(technos, function(doc) {
// 	if (Technos.find({
// 			name: doc.name
// 		}).count() === 0) {
// 		console.log("\tinserting techno: " + doc.name);
// 		Technos.insert(doc);
// 	} else {
// 		console.log("\ttechno already present: " + doc.name);
// 	}
// });

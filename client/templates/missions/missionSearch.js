Template.missionSearch.onCreated(() => {
	console.log('Template.missionSearch.onCreated()');

	let template = Template.instance();

	template.searchQuery = new ReactiveVar({});
	template.searching = new ReactiveVar(false);

	template.autorun(() => {
		console.log("template.autorun");
		template.subscribe('mission.search', template.searchQuery.get(), () => {
			console.log("template.searchQuery.get() changed");

			setTimeout(() => {

				console.log("setTimeout ! searching = false");
				template.searching.set(false);
			}, 300);
		});
	});

});

Template.missionSearch.helpers({
	searching() {
		console.log('Template.missionSearch.helpers searching()');

		return Template.instance().searching.get();
	},
	query() {
		console.log('Template.missionSearch.helpers query()');

		return Template.instance().searchQuery.get();
	},
	missions() {
		console.log('Template.missionSearch.helpers missions()');

		let missions = Missions.find({}, { sort: { updated: -1 } });
		if (missions) {
			return missions;
		}
	},
	getCategories() {
		if (!this.categories) {
			return "";
		}
		return this.categories.join(", ");
	},
});

Template.missionSearch.events({

	'keyup [name="search-name"]'(event, template) {
		console.log('keyup [name="search-name"]');

		let value = event.target.value.trim();
		let obj = template.searchQuery.get();

		if (value !== '' && event.keyCode === 13) {
			obj.name = value;
			template.searchQuery.set(obj);
			template.searching.set(true);
		}

		if (value === '') {
			obj.name = value;
			template.searchQuery.set(obj);
		}
		console.log(obj);
	},

	'keyup [name="search-description"]'(event, template) {
		console.log('keyup [name="search-description"]');

		let value = event.target.value.trim();
		let obj = template.searchQuery.get();

		if (value !== '' && event.keyCode === 13) {
			obj.description = value;
			template.searchQuery.set(obj);
			template.searching.set(true);
		}

		if (value === '') {
			obj.description = value;
			template.searchQuery.set(obj);
		}

		console.log(obj);
	},

	'keyup [name="search-techs"]'(event, template) {
		console.log('keyup [name="search-techs"]');

		let value = event.target.value.trim();
		let arrvalue = event.target.value.trim().split(",");
		console.log(value);
		let obj = template.searchQuery.get();

		if (arrvalue !== '' && event.keyCode === 13) {
			obj.technos = arrvalue;
			template.searchQuery.set(obj);
			template.searching.set(true);
		}

		if (value === '') {
			obj.technos = [value];
			template.searchQuery.set(obj);
		}

		console.log(obj);
	},

	'keyup [name="search-tjm"]'(event, template) {
		console.log('keyup [name="search-tjm"]');

		let value = event.target.value;

		let obj = template.searchQuery.get();

		if (value > 0 && event.keyCode === 13) {
			obj.tjm = value;
			template.searchQuery.set(obj);
			template.searching.set(true);
		}

		if (value === '') {
			obj.tjm = -1;
			template.searchQuery.set(obj);
		}

		console.log(obj);
	},

	'keyup [name="search-city"]'(event, template) {
		console.log('keyup [name="search-city"]');

		let value = event.target.value.trim();
		let obj = template.searchQuery.get();

		if (value !== '' && event.keyCode === 13) {
			obj.location = value;
			template.searchQuery.set(obj);
			template.searching.set(true);
		}

		if (value === '') {
			obj.location = value;
			template.searchQuery.set(obj);
		}

		console.log(obj);
	},

	'keyup [name="search-category"]'(event, template) {
		console.log('keyup [name="search-category"]');

		let value = event.target.value.trim();
		let obj = template.searchQuery.get();

		if (value !== '' && event.keyCode === 13) {
			obj.category = value;
			template.searchQuery.set(obj);
			template.searching.set(true);
		}

		if (value === '') {
			obj.category = value;
			template.searchQuery.set(obj);
		}

		console.log(obj);
	},

	'keyup [name="search-start"]'(event, template) {
		console.log('keyup [name="search-start"]');

		let value = event.target.value.trim();
		let obj = template.searchQuery.get();
		var reg = /^\d{4}-\d{2}-\d{2}$/i;
		var ok = reg.test(value);

		if (value !== '' && event.keyCode === 13) {
			if (ok === false) {
				sAlert.error("Mauvais format de date. Utiliser le format suivant: 'aaaa-mm-jj'. Ex: 2016-04-01 pour le 01/04/2016)");
			} else {

				obj.start = value;
				template.searchQuery.set(obj);
				template.searching.set(true);
			}
		}
		if (value === '') {
			obj.start = value;
			template.searchQuery.set(obj);
		}
	},
});
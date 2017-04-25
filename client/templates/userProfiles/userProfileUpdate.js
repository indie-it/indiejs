// config cloudinary
$.cloudinary.config = {
	cloud_name: 'indieit',
	api_key: '365732358393369'
};


Template.update.helpers({
	"getProfilePicSrc": function () {
		if (!this.profile || !this.profile.profilePic) {
			return "/img/profile-pic-placeholder.png";
		}
		return this.profile.profilePic.url;
	},
	"tagsOptions": function () {
		return {
			placeholder: 'foo',
			tags: true,
			language: {
				"noResults": function () {
					return "No Results Found <a href='#' class='btn btn-danger'>Add</a>";
				}
			},
			escapeMarkup: function (markup) {
				return markup;
			},
		};
	},
});

// évenements du template
Template.update.events({
	"change input#profile-pic-file-input[type='file']": function (e) {
		// stocke le fichier en mémoire sur le navigateur
		files = e.currentTarget.files;

		if (!FileReader) { return; }

		var file = files[0];
		var reader = new FileReader();
		reader.onload = function () {
			document.getElementById('profile-pic-image').src = this.result;
		};

		reader.readAsDataURL(file);
	}
});
// config cloudinary
$.cloudinary.config = {
	cloud_name: 'indieit',
	api_key: '365732358393369'
};


Template.update.helpers({
	"getProfilePicSrc": function () {
		if (!this.profile.profilePic) {
			return "/img/profile-pic-placeholder.png";
		}
		return this.profile.profilePic.url;
	},
});

// �venements du template
Template.update.events({
	"change input#profile-pic-file-input[type='file']": function (e) {
		// stocke le fichier en m�moire sur le navigateur
		files = e.currentTarget.files;
	}
});
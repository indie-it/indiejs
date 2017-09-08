Template['freelance-update'].helpers({
	"getTemplateName": () => {
        var section = Session.get('freelance-section');
        if (!section) { section = 'contact'; }
        console.log(`[getTemplateName] section: ${section}`);
        return `freelance-update-${section}`;
	},
    "isActive": () => {
        // TODO : coder isActive !
        var section = Session.get('freelance-section');
        if (!section) { section = 'contact'; }
        return "";
    },
});
Template['freelance-update'].events({
    "click a": function(event, template) {
        var section = event.target.id;
        Session.set('freelance-section', section);
    },
});


Template['freelance-update-contact'].helpers({
	"getProfilePicSrc": function () {
		// console.log(this);
		if (!this || !this.photo) {
			return "/img/profile-pic-placeholder.png";
		}
		return this.photo.secureUrl;
	},
});
Template['freelance-update-contact'].events({
	"change input#profile-pic-file-input[type='file']": function (e) {
		// stocke le fichier en mémoire sur le navigateur
		files = e.currentTarget.files;

		if (!FileReader) { return; }

		var file = files[0];
		var reader = new FileReader();
		reader.onload = function () {
			document.getElementById('profile-pic-image').src = this.result;

			Modal.hide();

		};

		reader.readAsDataURL(file);

		Modal.show("loading-modal-generic", { title: "Chargement", text: "Chargement de l'image dans le navigateur. Veuillez patienter..."}, { backdrop: 'static', keyboard: false });

	}
});

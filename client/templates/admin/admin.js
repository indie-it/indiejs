Template.admin.helpers({
	"getAdminTemplateName": () => {
        let section = Session.get('admin-section');
        if (!section) { section = 'actions'; }
        return `admin-${section}`;
	},
    "isActive": (id) => {
        let section = Session.get('admin-section');
        if (!section) { section = 'actions'; }
        return (id === section) ? "active" : "";
    },
});
Template.admin.events({
    "click div.admin-pane ul > li > a": function(event, template) {
        let section = event.target.id;
        console.log(section);
        Session.set('admin-section', section);
    },
});




Template["admin-contact"].events({
	"click #btn-send": (event, template) => {
		let title = MarkdownEditor.getPostTitle();
		let html = MarkdownEditor.getHtml();
		let tags = MarkdownEditor.getTags();

		if (!title || !html){
			sAlert.error("Merci de renseigner le titre et le corps du message");
			return;
		}

		Meteor.call("admin.email.send", title, html, (error, result) => {
			if (error) {
				sAlert.error(error);
			}
			if (result) {
			 	console.log(result);
				sAlert.success("Le courriel a bien été envoyé.");
			}
		});
	},
});

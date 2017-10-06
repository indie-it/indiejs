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

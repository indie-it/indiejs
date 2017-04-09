Utils = {
    formatDate: function(date) {
        return moment(date).format('DD/MM/YYYY');
    },
    pathFor: function(routeName, params){
        // Similaire au helper "pathFor", mais utilisable directement dans le code
        var route = Router.routes[routeName].path(params);
        return route;
	},
};

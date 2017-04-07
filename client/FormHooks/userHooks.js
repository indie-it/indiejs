AutoForm.hooks({
    'insertUser': {

        onSubmit: function(doc) { // Gestion du formulaire d'inscription
            // console.log(doc);
            var error = null;
            var password = doc.password;
            var email = doc.emails[0].address;

            Accounts.createUser({
                username: doc.username,
                email: email,
                password: password,
                profile: doc.profile ? doc.profile : {}
            }, function(err) {
                if(err) {
                    error = new Error("Une erreur s'est produite");
                }
            });

            if (error === null) {
                this.done(); // Appelle onSuccess
            }
            else {
                this.done(error); // Appelle onError
            }

            return false; // Dans tous les cas, arrête la soumission des donneés.
        },

        onSuccess: function() {
            Router.go(Utils.pathFor('home'));
        },

        onError: function(formType, err) {
          var error = err.reason ? err.reason : err;
          alert(error);
        }

    }
});

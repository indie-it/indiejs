import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { HTTP } from 'meteor/http';

Meteor.methods({

	"user.linkedin.setState": function (state) {
		if (!Meteor.userId()) { return false; }

		console.log("user.linkedin.setState");

		// validation param
		new SimpleSchema({ state: { type: String } }).validate({ state });

		// mise à jour ou upsert (insertion si doc non trouvé)
		LinkedInStuff.update(Meteor.userId(), { $set: { state: state } }, { upsert: true }, function (err) {
			if (err) {
				throw new Meteor.Error(500, err.message);
			}
			return true;
		});
	},

	"user.linkedin.getAuthenticationToken": function (state, code) {
		if (!Meteor.userId()) { return false; }

		console.log("user.linkedin.getAuthenticationToken");

		new SimpleSchema({ state: String, code: String }).validate({ state, code });

		//check state 
		var stuffObj = LinkedInStuff.findOne(Meteor.userId());
		if (!stuffObj) {
			return { success: false, error: "Aucun état en base." };
		}

		// cas normal
		if (stuffObj.state !== state) {
			return { success: false, error: "L'état en base ne correspond pas." };
		}

		this.unblock();

		try {

			// appel ajax via le paquet http
			const result = HTTP.call('POST', ServerGlobals.linkedin.authTokenUri, {
				params: {
					'grant_type': "authorization_code",
					'code': code,
					'redirect_uri': ServerGlobals.linkedin.redirectUri,
					'client_id': ServerGlobals.linkedin.clientId,
					'client_secret': ServerGlobals.linkedin.clientSecret,
				}
			});

			//console.log(result);
			if (!result.data) {
				return { success: false, error: "L'appel AJAX sur l'API LinkedIn n'a pas retourné les données attendues." };
			}

			// calcul des dates
			const now = new Date();
			var d = new Date();
			const expirationDate = d.setSeconds(d.getSeconds() + result.data.expires_in);

			//stocker le jeton d'authentification en base!
			LinkedInStuff.update(Meteor.userId(), {
				$set: {
					'authorizationCode': code,
					'accessToken': result.data.access_token,
					'accessTokenCreationDate': now,
					'accessTokenExpiresIn': result.data.expires_in,
					'accessTokenExpirationDate': expirationDate,
				}
			});

			return { success: true };

		} catch (e) {

			return { success: false, error: "Echec de l'appel AJAX sur l'API LinkedIn." };

		}

	},

	"user.linkedin.getProfileInfo": function () {
		if (!Meteor.userId()) { return false; }

		console.log(`user.linkedin.getProfileInfo - Meteor.userId(): ${Meteor.userId()}`);

		var stuff = LinkedInStuff.findOne(Meteor.userId());
		if (!stuff || !stuff.accessToken) {
			return false;
		}

		var linkedin = Linkedin().init(stuff.accessToken);
		if (!linkedin) {
			return false;
		}

		try {
			// on utilise le wrappeur asynchrone
			// car le code à l'intérieur des callback sur le serveur est interdit
			var res = Meteor.wrapAsync(linkedin.people.me, linkedin.people)();

			console.log(res);

			//mise à jour du profil avec les infos récupérées
			const set = {};

			if (res.firstName) { set.firstName = res.firstName; }
			if (res.lastName) { set.lastName = res.lastName; }
			if (res.headline) { set.title = res.headline; }
			if (res.summary) { set.description = res.summary; }
			if (res.location && res.location.name) { set.location = res.location.name; }
			if (res.industry) { set.industry = res.industry; }
			if (res.positions && res.positions.values && res.positions._total > 0) {
				var pos = res.positions.values[0];
				// TODO !
				console.log(pos);
			}

			if (!set.firstName && !set.lastName && !set.title) {
				console.log("Nothing to set!");
				return false;
			}

			//màj ou insert si non trouvé
			var res = UserProfiles.update({ userid: Meteor.userId() }, { $set: set }, { upsert: true });
		}
		catch (e) {
			console.error(e);
			return false;
		}

		return true;
	},

});
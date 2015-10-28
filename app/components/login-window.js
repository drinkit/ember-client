import Ember from 'ember';
import CryptoJS from 'npm:crypto-js';

export default Ember.Component.extend({
	email: "",
	password: "",
    authService: Ember.inject.service("auth"),
	actions: {
		login() {
			this.get("authService").setCredentials(this.get("email"), CryptoJS.SHA256("drinkit" + this.get("password")));
		}
	}

});

import Ember from 'ember';

export default Ember.Component.extend({
	email: "",
	password: "",
	actions: {
		login() {
			DigestRequestUtil.setCredentials(this.get("email"), CryptoJS.SHA256("drinkit" + this.get("password")));
		}
	}

});

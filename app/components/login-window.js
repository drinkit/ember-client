import Ember from 'ember';
import CryptoJS from 'npm:crypto-js';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
	actions: {
		login() {
			let { email, password } = this.getProperties('email', 'password');
			this.get("session").authenticate('autheticator:digest', 
				email, CryptoJS.SHA256("drinkIt" + password).toString()).catch((reason) => {
        		this.set('errorMessage', reason.error);
      		});
		}
	}

});

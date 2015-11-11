import Ember from 'ember';
import CryptoJS from 'npm:crypto-js';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
	ajax: Ember.inject.service('ajax'),

	hasError: false,

	actions: {
		login() {
			this.set('hasError', false);
			let { email, password } = this.getProperties('email', 'password');
			var self = this;
			this.get("session").authenticate('autheticator:digest', email, 
				CryptoJS.SHA256("drinkIt" + password).toString()).then(function() {
				//
			},
			function (reason) {
			    self.set('hasError', true);
	  		});
		}
	}

});

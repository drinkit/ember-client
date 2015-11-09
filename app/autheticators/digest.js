import Base from 'ember-simple-auth/authenticators/base';
import Ember from 'ember';
import CryptoJS from 'npm:crypto-js';

export default Base.extend({

	restore: function(data) {
		if (data.email && data.password) {
			return new Ember.RSVP.Promise(function(resolve, reject) {
				resolve({email: data.email, password: data.password, digests: {}});
			});
		}
	},

	authenticate: function(email, password) {
		var self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
			Ember.run(function() {
				resolve({email: email, password: password, digests: {}});
			});
		});
	},

	invalidate: function(data) {
		//
	}
});
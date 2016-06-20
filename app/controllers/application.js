import Ember from 'ember';

export default Ember.Controller.extend({
	currentUser: Ember.inject.service('current-user'),

	isLoggedIn: function() {
		return this.get('currentUser').get('isAuthenticated');
	}.property('currentUser.isAuthenticated'),

	actions: {
		showDialog: function(dialogName) {
			this.set('isShow' + dialogName, true);
		},

		hideDialog: function(dialogName) {
			this.set('isShow' + dialogName, false);
		}
	}
});

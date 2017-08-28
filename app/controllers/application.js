import Ember from 'ember';

export default Ember.Controller.extend({
	currentUser: Ember.inject.service(),
	modalManager: Ember.inject.service(),
	simpleStore: Ember.inject.service(),

	searchableItems: Ember.computed('property', function() {
	  simpleStore.
	}),

	isLoggedIn: function() {
		return this.get('currentUser').get('isAuthenticated');
	}.property('currentUser.isAuthenticated'),

	actions: {
		showDialog: function(dialogName) {
			this.get('modalManager').showDialog(dialogName);
		},

		hideDialog: function(dialogName) {
			this.get('modalManager').hideDialog(dialogName);
		}
	}
});

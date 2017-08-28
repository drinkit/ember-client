import Ember from 'ember';

export default Ember.Controller.extend({
	currentUser: Ember.inject.service(),
	modalManager: Ember.inject.service(),
	repository: Ember.inject.service(),

	searchableItems: Ember.computed('', function() {
		const self = this;
		let promise = new Promise(function(resolve, reject) {
			const repository = self.get('repository');
			repository.find('ingredient', {
				url: '/ingredients',
				method: 'GET'
			}).then((result) => {
				let items = result.map(i => i.get('name'));
				resolve(items);
			});
		});
		return promise;
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

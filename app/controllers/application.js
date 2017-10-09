import Ember from 'ember';

export default Ember.Controller.extend({
  currentUser: Ember.inject.service(),
  modalManager: Ember.inject.service(),
  repository: Ember.inject.service(),

	filteredSearchableItems: Ember.computed('searchableItems.[]', 'currentUser.role', function() {
		const user = this.get('currentUser');
		let filteredItems = [];
		for (let i = 0; i < this.get('searchableItems').length; i++) {
			if (this.get('searchableItems')[i].groupName === 'Коктейли') {
				let recipes = this.get('searchableItems')[i].options;
				let filteredRecipes = recipes.filter(item => item.published || user.get('role') == 'ADMIN');
				filteredItems.push({groupName: 'Коктейли', options: filteredRecipes});
			} else {
				filteredItems.push(this.get('searchableItems')[i]);
			}
		}

	  return filteredItems;
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

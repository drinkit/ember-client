import Ember from 'ember';

export default Ember.Route.extend({
	metrics: Ember.inject.service(),

	model() {
		return new Ember.RSVP.hash({
			ingredients: this.store.findAll('ingredient'),
			recipes: this.store.peekAll('recipe')
		});
	},

	setupController: function(controller, modelHash) {
	    controller.setProperties(modelHash);
	    controller.performSearch();
	},

	actions: {
	  didTransition: function() {
			const page = "/#";
      const title = "";
			this.get('metrics').trackPage({page, title});
		}
	}
});

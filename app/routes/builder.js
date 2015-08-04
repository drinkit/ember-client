import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return new Ember.RSVP.hash({
			ingredients: this.store.findAll('ingredient'),
			recipes: this.store.peekAll('recipe')
		});
	},

	setupController: function(controller, modelHash) {
	    controller.setProperties(modelHash);
	}
});

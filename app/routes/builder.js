import Ember from 'ember';
import RememberScrollMixin from '../mixins/remember-scroll';

export default Ember.Route.extend(RememberScrollMixin, {
	metrics: Ember.inject.service(),

	titleToken: 'Конструктор коктейлей',

	model() {
		let ingredients = this.store.peekAll('ingredient');
		return new Ember.RSVP.hash({
			ingredients: ingredients.get('length') > 0 ? ingredients : this.store.findAll('ingredient'),
			recipes: this.store.peekAll('recipe')
		});
	},

	setupController: function(controller, modelHash) {
	    controller.setProperties(modelHash);
	    controller.performSearch();
	},

	actions: {
	  didTransition: function() {
			Ember.run.scheduleOnce('afterRender', this, () => {
				const page = "/builder";
				const title = "drinkIt";
				this.get('metrics').trackPage({page, title});
			});
		}
	}
});

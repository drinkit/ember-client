import Ember from 'ember';

export default Ember.Controller.extend({
	ingredients: function() {
		var self = this;
		this.store.findAll('ingredient').then(function() {
			var ingredients = self.get('model').get('ingredientsWithQuantities').map(function(item) {
				return {
					name: self.store.peekRecord('ingredient', item.ingredientId).get('name'), 
					quantity: item.quantity
				};
			});

			self.set('ingredients', ingredients);
		});
	}.property('model.ingredientsWithQuantities')
});

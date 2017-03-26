import Ember from 'ember';

export default Ember.Controller.extend({
  repository: Ember.inject.service(),
  simpleStore: Ember.inject.service(),

  modelChanged: Ember.observer('model', function() {
    this.updateSuggestedRecipes(this.get('model'));
  }),

  updateSuggestedRecipes(model) {
    const store = this.get('simpleStore');
    const repository = this.get('repository');
    const self = this;
    store.clear('suggestedRecipe');
    this.set('suggestedRecipesInitialized', false);
    repository.find('suggestedRecipe', {
      url: '/recipes',
      method: 'GET',
      data: {
        criteria: JSON.stringify({
          ingredients: [model.get('id')],
          cocktailTypes: [],
          options: []
        })
      }
    }).then(function(response) {
      self.set('suggestedRecipesInitialized', true);
      self.set('suggestedRecipes', response);
    }, function() {
      self.set('suggestedRecipesInitialized', true);
      self.set('suggestedRecipes', []);
    });
  }
});

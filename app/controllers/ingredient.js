import Ember from 'ember';

export default Ember.Controller.extend({
  repository: Ember.inject.service(),
  simpleStore: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  currentIngredient: null,

  modelChanged: Ember.observer('ingredientId', function() {
    const store = this.get('simpleStore');
    this.set('currentIngredient', store.find('ingredient', this.get('ingredientId')));
    this.updateSuggestedRecipes(this.get('currentIngredient'));
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
      let user = self.get('currentUser');
      let filteredSuggestedRecipes = response;
      if (user.get('role') != 'ADMIN') {
        filteredSuggestedRecipes = response.filter((item) => item.get('published'));
      }
      self.set('suggestedRecipesInitialized', true);
      self.set('suggestedRecipes', filteredSuggestedRecipes);
    }, function() {
      self.set('suggestedRecipesInitialized', true);
      self.set('suggestedRecipes', []);
    });
  }
});

import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  repository: service(),
  simpleStore: service(),
  currentUser: service(),
  currentIngredient: null,

  modelChanged: observer('ingredientId', function() {
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
      body: {
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

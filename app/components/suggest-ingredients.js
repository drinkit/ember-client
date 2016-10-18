import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['bar-category-box'],
  simpleStore: Ember.inject.service(),

  firstIngredientName: Ember.computed('suggestedIngredients.[]', function() {
    const store = this.get('simpleStore');
    if (this.get('suggestedIngredients.length') > 0) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(0);
      let ingredient = store.find('ingredient', sugIngredient.get('ingredientId'));
      return ingredient.get('name');
    }
  }),
  secondIngredientName: Ember.computed('suggestedIngredients.[]', function() {
    const store = this.get('simpleStore');
    if (this.get('suggestedIngredients.length') > 0) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(1);
      let ingredient = store.find('ingredient', sugIngredient.get('ingredientId'));
      return ingredient.get('name');
    }
  }),
  thirdIngredientName: Ember.computed('suggestedIngredients.[]', function() {
    const store = this.get('simpleStore');
    if (this.get('suggestedIngredients.length') > 0) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(2);
      let ingredient = store.find('ingredient', sugIngredient.get('ingredientId'));
      return ingredient.get('name');
    }
  }),
  firstIngredientCocktails: Ember.computed('suggestedIngredients.[]', function () {
    const store = this.get('simpleStore');
    if (this.get('suggestedIngredients.length') > 0) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(0);
      let recipes = sugIngredient.get('recipeIds').map((item) => store.find('recipe', item));
      return recipes;
    }
  }),
  secondIngredientCocktails: Ember.computed('suggestedIngredients.[]', function () {
    const store = this.get('simpleStore');
    if (this.get('suggestedIngredients.length') > 0) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(1);
      let recipes = sugIngredient.get('recipeIds').map((item) => store.find('recipe', item));
      return recipes;
    }
  }),
  thirdIngredientCocktails: Ember.computed('suggestedIngredients.[]', function () {
    const store = this.get('simpleStore');
    if (this.get('suggestedIngredients.length') > 0) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(2);
      let recipes = sugIngredient.get('recipeIds').map((item) => store.find('recipe', item));
      return recipes;
    }
  })
});

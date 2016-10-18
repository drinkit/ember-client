import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['suggestions-box'],
  simpleStore: Ember.inject.service(),

  ingredientsNames: Ember.computed('suggestedIngredients.[]', function() {
    let ingredientsNames = [];
    const store = this.get('simpleStore');
    for (var i = 0; i < this.get('suggestedIngredients.length'); i++) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(i);
      let ingredient = store.find('ingredient', sugIngredient.get('ingredientId'));
      ingredientsNames.push(ingredient.get('name'));
    }
    return ingredientsNames;
  }),

  ingredientsCocktails: Ember.computed('suggestedIngredients.[]', function() {
    let ingredientsCocktails = [];
    const store = this.get('simpleStore');
    for (var i = 0; i < this.get('suggestedIngredients.length'); i++) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(i);
      let recipes = sugIngredient.get('recipeIds').map((item) => store.find('recipe', item));
      ingredientsCocktails.push(recipes);
    }
    return ingredientsCocktails;
  }),

  phraseEndings: Ember.computed('ingredientsCocktails.[]', function() {
    let phraseEndings = [];
    for (var i = 0; i < this.get('ingredientsCocktails.length'); i++) {
      phraseEndings.push(this.getCocktailsEnding(this.get('ingredientsCocktails')[i].length));
    }
    return phraseEndings;
  }),

  getCocktailsEnding(number) {
    switch (number % 10) {
      case 0:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        return Ember.String.htmlSafe(number.toString() + ' коктейлей.');
        break;
      case 1:
        return Ember.String.htmlSafe(number.toString() + ' коктейль.');
        break;
      case 2:
      case 3:
      case 4:
        return Ember.String.htmlSafe(number.toString() + ' коктейля.')
        break;
    }
  }

  // firstIngredientName: Ember.computed('suggestedIngredients.[]', function() {
  //   const store = this.get('simpleStore');
  //   if (this.get('suggestedIngredients.length') > 0) {
  //     let sugIngredient = this.get('suggestedIngredients').objectAt(0);
  //     let ingredient = store.find('ingredient', sugIngredient.get('ingredientId'));
  //     return ingredient.get('name');
  //   }
  // }),
  // secondIngredientName: Ember.computed('suggestedIngredients.[]', function() {
  //   const store = this.get('simpleStore');
  //   if (this.get('suggestedIngredients.length') > 1) {
  //     let sugIngredient = this.get('suggestedIngredients').objectAt(1);
  //     let ingredient = store.find('ingredient', sugIngredient.get('ingredientId'));
  //     return ingredient.get('name');
  //   }
  // }),
  // thirdIngredientName: Ember.computed('suggestedIngredients.[]', function() {
  //   const store = this.get('simpleStore');
  //   if (this.get('suggestedIngredients.length') > 2) {
  //     let sugIngredient = this.get('suggestedIngredients').objectAt(2);
  //     let ingredient = store.find('ingredient', sugIngredient.get('ingredientId'));
  //     return ingredient.get('name');
  //   }
  // }),
  // firstIngredientCocktails: Ember.computed('suggestedIngredients.[]', function () {
  //   const store = this.get('simpleStore');
  //   if (this.get('suggestedIngredients.length') > 0) {
  //     let sugIngredient = this.get('suggestedIngredients').objectAt(0);
  //     let recipes = sugIngredient.get('recipeIds').map((item) => store.find('recipe', item));
  //     return recipes;
  //   }
  // }),
  // secondIngredientCocktails: Ember.computed('suggestedIngredients.[]', function () {
  //   const store = this.get('simpleStore');
  //   if (this.get('suggestedIngredients.length') > 1) {
  //     let sugIngredient = this.get('suggestedIngredients').objectAt(1);
  //     let recipes = sugIngredient.get('recipeIds').map((item) => store.find('recipe', item));
  //     return recipes;
  //   }
  // }),
  // thirdIngredientCocktails: Ember.computed('suggestedIngredients.[]', function () {
  //   const store = this.get('simpleStore');
  //   if (this.get('suggestedIngredients.length') > 2) {
  //     let sugIngredient = this.get('suggestedIngredients').objectAt(2);
  //     let recipes = sugIngredient.get('recipeIds').map((item) => store.find('recipe', item));
  //     return recipes;
  //   }
  // }),
  // firstIngredientPhraseEnding: Ember.computed('firstIngredientCocktails.[]', function() {
  //   let length = this.get('firstIngredientCocktails.length');
  //   switch (length % 10) {
  //     case 0:
  //     case 5:
  //     case 6:
  //     case 7:
  //     case 8:
  //     case 9:
  //       return Ember.String.htmlSafe(length.toString() + ' коктейлей.');
  //       break;
  //     case 1:
  //       return Ember.String.htmlSafe(length.toString() + ' коктейль.');
  //       break;
  //     case 2:
  //     case 3:
  //     case 4:
  //       return Ember.String.htmlSafe(length.toString() + ' коктейля.')
  //       break
  //   }
  // })
});

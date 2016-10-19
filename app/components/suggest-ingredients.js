import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['suggestions-box'],
  simpleStore: Ember.inject.service(),
  currentUser: Ember.inject.service(),

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
    const user = this.get('currentUser');
    for (var i = 0; i < this.get('suggestedIngredients.length'); i++) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(i);
      let recipes = sugIngredient.get('recipeIds').map((item) => store.find('recipe', item));
      recipes = recipes.filter((item) => item.get('published') || user.get('role') == 'ADMIN');
      ingredientsCocktails.push(recipes);
    }
    return ingredientsCocktails;
  }),

  wholePhrases: Ember.computed('ingredientsCocktails.[]', function() {
    let phrases = [];
    for (var i = 0; i < this.get('ingredientsCocktails.length'); i++) {
      let phrase = '...**' + this.get('ingredientsNames')[i] + '** - ';
      let cocktails = this.get('ingredientsCocktails')[i];
      for (var k = 0; k < cocktails.length; k++) {
        if (k == 2) {
          break;
        }
        phrase += '[' + cocktails[k].get('name') + '](/recipes/' + cocktails[k].get('id') + '), ';
      }

      if (cocktails.length > 2) {
        phrase += 'и еще ' + this.getCocktailsEnding(cocktails.length - 2);
      } else {
        phrase = phrase.substr(0, phrase.length - 2) + '.';
      }
      phrases.push(phrase);
    }
    return phrases;
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
});

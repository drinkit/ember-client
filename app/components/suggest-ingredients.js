import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['suggestions-box'],
  simpleStore: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  initialized: false,

  hasData: Ember.computed('suggestedIngredients.[]', function() {
    return this.get('suggestedIngredients.length') > 0;
  }),

  ingredientsCocktails: Ember.computed('suggestedIngredients.[]', function() {
    let ingredientsCocktails = [];
    const store = this.get('simpleStore');
    const user = this.get('currentUser');
    const suggestionsCount = 3;
    let suggestionsLen = Math.min(suggestionsCount, this.get('suggestedIngredients.length'));
    for (var i = 0; i < suggestionsLen; i++) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(i);
      let ingredient = store.find('ingredient', sugIngredient.get('ingredientId'));
      let recipesIds = sugIngredient.get('recipeIds');
      let sugRecipes = store.find('recipe', (item) => recipesIds.includes(item.get('id')) && (item.get('published') || user.get('role') == 'ADMIN'));
      ingredientsCocktails.push({
        name: ingredient.get('name'),
        recipes: sugRecipes.get('content'),
        hasData: sugRecipes.get('content.length') > 0
      });
    }

    return ingredientsCocktails;
  }),

  wholePhrases: Ember.computed('ingredientsCocktails.[]', function() {
    let phrases = [];
    const cocktailsCount = 3;
    for (var i = 0; i < this.get('ingredientsCocktails.length'); i++) {
      if (!this.get('ingredientsCocktails')[i].hasData) {
        continue;
      }
      let phrase = '**' + this.get('ingredientsCocktails')[i].name + '** - ';
      let cocktails = this.get('ingredientsCocktails')[i].recipes;
      for (var k = 0; k < cocktails.length; k++) {
        if (k == cocktailsCount) {
          break;
        }
        phrase += '[' + cocktails[k].get('name') + '](/recipes/' + cocktails[k].get('id') + '), ';
      }

      if (cocktails.length > cocktailsCount) {
        phrase += 'и еще ' + this.getCocktailsEnding(cocktails.length - cocktailsCount);
      } else {
        phrase = phrase.substr(0, phrase.length - 2) + '.';
      }
      phrases.push(phrase);
    }
    return phrases;
  }),
  // works wrong with 11 - 19
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
        return Ember.String.htmlSafe(number.toString() + ' коктейля.');
        break;
    }
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['suggestions-box'],
  simpleStore: Ember.inject.service(),
  currentUser: Ember.inject.service(),

  hasData: Ember.computed('suggestedIngredients.[]', function() {
    return this.get('suggestedIngredients.length') > 0;
  }),

  ingredientsCocktails: Ember.computed('suggestedIngredients.[]', function() {
    let ingredientsCocktails = [];
    const store = this.get('simpleStore');
    const user = this.get('currentUser');
    for (var i = 0; i < this.get('suggestedIngredients.length'); i++) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(i);
      let ingredient = store.find('ingredient', sugIngredient.get('ingredientId'));
      let recipes = sugIngredient.get('recipeIds').map((item) => store.find('recipe', item));
      recipes = recipes.filter((item) => item.get('published') || user.get('role') == 'ADMIN');
      ingredientsCocktails.push({
        name: ingredient.get('name'),
        recipes: recipes,
        hasData: recipes.length > 0
      });
    }
    ingredientsCocktails = ingredientsCocktails.sort((a1, a2) => a2.recipes.length - a1.recipes.length);
    return ingredientsCocktails;
  }),

  wholePhrases: Ember.computed('ingredientsCocktails.[]', function() {
    let phrases = [];
    const cocktailsCount = 3;
    for (var i = 0; i < this.get('ingredientsCocktails.length'); i++) {
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

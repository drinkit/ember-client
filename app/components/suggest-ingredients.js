import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  scrollSelector: window,
  classNames: ['flex-1 p-5px mx-21px mt-20px mb-15px rounded-5px shadow-recipe font-gothic'],
  simpleStore: service(),
  currentUser: service(),
  initialized: false,
  suggestionsCount: 3,

  actions: {
    getMoreSuggestion() {
      this.set('suggestionsCount', this.get('suggestionsCount') + 3);
      let self = this;
      next(function() {
        self.scrollSelector.scrollTo(0, document.body.scrollHeight);
      });
    }
  },

  hasData: computed('suggestedIngredients.[]', function() {
    return this.get('suggestedIngredients.length') > 0;
  }),

  showButtonForExtraSuggestion: computed('suggestedIngredients.[]', 'suggestionsCount', function() {
    return this.get('suggestedIngredients.length') > this.get('suggestionsCount');
  }),

  ingredientsCocktails: computed('suggestedIngredients.[]', 'suggestionsCount', function() {
    let ingredientsCocktails = [];
    const store = this.get('simpleStore');
    const user = this.get('currentUser');
    let suggestionsLen = Math.min(this.get('suggestionsCount'), this.get('suggestedIngredients.length'));
    for (var i = 0; i < suggestionsLen; i++) {
      let sugIngredient = this.get('suggestedIngredients').objectAt(i);
      let ingredient = store.find('ingredient', sugIngredient.get('ingredientId'));
      let recipesIds = sugIngredient.get('recipeIds');
      let sugRecipes = store.find('recipe', (item) => recipesIds.includes(item.get('id')) && (item.get('published') || user.get('role') == 'ADMIN'));
      ingredientsCocktails.push({
        id: ingredient.get('id'),
        name: ingredient.get('name'),
        recipes: sugRecipes.get('content'),
        hasData: sugRecipes.get('content.length') > 0
      });
    }

    return ingredientsCocktails;
  }),

  wholePhrases: computed('ingredientsCocktails.[]', function() {
    let phrases = [];
    const cocktailsCount = 3;
    for (var i = 0; i < this.get('ingredientsCocktails.length'); i++) {
      let ingredient = this.get('ingredientsCocktails')[i];
      if (!ingredient.hasData) {
        continue;
      }
      let phrase = '**[' + ingredient.name + '](/ingredients/' + ingredient.id + ')** - ';
      let cocktails = ingredient.recipes;
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
    if (number >= 11 && number <= 19) {
      return htmlSafe(number.toString() + ' коктейлей.');
    }
    switch (number % 10) {
      case 0:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        return htmlSafe(number.toString() + ' коктейлей.');
      case 1:
        return htmlSafe(number.toString() + ' коктейль.');
      case 2:
      case 3:
      case 4:
        return htmlSafe(number.toString() + ' коктейля.');
    }
  }
});

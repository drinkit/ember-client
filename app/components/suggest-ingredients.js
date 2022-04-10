import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class SuggestIngredients extends Component {
  @service simpleStore;
  @service currentUser;

  @tracked
  suggestionsCount = 3;

  constructor(owner, args) {
    super(owner, args);
    this.scrollSelector = window;
  }

  @action
  getMoreSuggestion() {
    this.suggestionsCount += 3;
    let self = this;
    next(function() {
      self.scrollSelector.scrollTo(0, document.body.scrollHeight);
    });
  }

  get hasData() {
    return this.args.suggestedIngredients.length> 0;
  }

  get showButtonForExtraSuggestion() {
    return this.args.suggestedIngredients.length > this.suggestionsCount;
  }

  get ingredientsCocktails() {
    let ingredientsCocktails = [];
    const store = this.simpleStore;
    const user = this.currentUser;
    let suggestionsLen = Math.min(this.suggestionsCount, this.args.suggestedIngredients.length);
    for (let i = 0; i < suggestionsLen; i++) {
      let sugIngredient = this.args.suggestedIngredients.objectAt(i);
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
  }

  get wholePhrases() {
    let phrases = [];
    const cocktailsCount = 3;
    for (let i = 0; i < this.ingredientsCocktails.length; i++) {
      let ingredient = this.ingredientsCocktails[i];
      if (!ingredient.hasData) {
        continue;
      }
      let phrase = '**[' + ingredient.name + '](/ingredients/' + ingredient.id + ')** - ';
      let cocktails = ingredient.recipes;
      for (let k = 0; k < cocktails.length; k++) {
        if (k === cocktailsCount) {
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
  }

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
}

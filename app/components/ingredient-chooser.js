import { set, action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class IngredientChooser extends Component {
  @tracked selectedIngredientsIds = A();
  @tracked ingredients = [];

  constructor(owner, args) {
    super(owner, args);
    this.buildIngredientsList(args.ingredients.toArray());
    this.selectedIngredientsIds = args.initSelectedIds;
  }

  convertToIngredientsIds(ingredients) {
    return ingredients.map((item) => item.groupId);
  }

  convertToIngredients(ingredientsIds) {
    return ingredientsIds.map(this.findIngredientByRealId, this);
  }

  buildIngredientsList(ingredients) {
    var expandedIngredients = [];
    var counter = 0;

    for (var i = 0; i < ingredients.length; i++) {
      var ingredient = ingredients[i];
      expandedIngredients.push({
        id: counter,
        name: ingredient.get('name').toLowerCase(),
        description: '',
        groupId: Number(ingredient.get('id')),
        isReal: true,
        disabled: false,
        category: ingredient.get('category')
      });

      if (ingredient.get('alias')) {
        for (var j = 0; j < ingredient.get('alias').length; j++) {
          counter++;
          var synonym = ingredient.get('alias')[j];
          expandedIngredients.push({
            id: counter,
            name: synonym.toLowerCase(),
            description: "(" + ingredient.get('name').toLowerCase() + ")",
            groupId: Number(ingredient.get('id')),
            isReal: false,
            disabled: false
          });
        }
      }

      counter++;
    }
    expandedIngredients.sort((a, b) => a.name < b.name ? -1 : 1);
    this.ingredients = expandedIngredients;
  }

  findIngredientByRealId(id) {
    for (var i = 0; i < this.filteredIngredients.length; i++) {
      if (this.filteredIngredients[i].groupId === id && this.filteredIngredients[i].isReal) {
        return this.filteredIngredients[i];
      }
    }
  }

  getAllSynonyms(id) {
    return this.filteredIngredients.filter(function(item) {
      return item.groupId == id;
    });
  }

  disableSynonyms(id) {
    var allSynonyms = this.getAllSynonyms(id);
    for (var i = 0; i < allSynonyms.length; i++) {
      set(allSynonyms[i], 'disabled', true);
    }
  }

  enableSynonyms(id) {
    var allSynonyms = this.getAllSynonyms(id);
    for (var i = 0; i < allSynonyms.length; i++) {
      set(allSynonyms[i], 'disabled', false);
    }
  }

  get selectedIngredients() {
    return this.convertToIngredients(this.selectedIngredientsIds);
  }

  get filteredIngredients() {
    return this.ingredients;
  }

  @action
  changeIngredients(ingredients) {
    let selected, deselected;

    if (ingredients instanceof Array) {
      const ingredientsIds = this.convertToIngredientsIds(ingredients);
      deselected = this.selectedIngredientsIds.filter(x => !ingredientsIds.includes(x));
      selected = ingredientsIds.filter(x => !this.selectedIngredientsIds.includes(x));
    } else {
      const ingredientId = ingredients.groupId;
      deselected = this.selectedIngredients.indexOf(ingredientId) >= 0 ? [ingredientId] : [];
      selected = this.selectedIngredients.indexOf(ingredientId) === -1 ? [ingredientId] : [];
    }

    if (selected.length > 0) {
      this.disableSynonyms(selected[0]);
      this.selectedIngredientsIds.pushObject(selected[0]);
    } else if (deselected.length > 0) {
      this.enableSynonyms(deselected[0]);
      this.selectedIngredientsIds.removeObject(deselected[0]);
    }

    this.args?.changeIngredients(this.selectedIngredientsIds);
  }
}

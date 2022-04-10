import { set, action } from '@ember/object';
import Component from '@glimmer/component';

export default class IngredientChooser extends Component {
  constructor(owner, args) {
    super(owner, args);
  }

  convertToIngredientsIds(ingredients) {
    return ingredients.map((item) => item.groupId);
  }

  convertToIngredients(ingredientsIds) {
    const ingredientsIdsSet = new Set(ingredientsIds);
    const foundedIngredients = [];
    const ingredients = this.filteredIngredients;
    for (let i = 0; i < ingredients.length; i++) {
      if (!ingredients[i].isReal) continue;
      if (ingredientsIdsSet.has(ingredients[i].groupId)) {
        foundedIngredients.push(ingredients[i]);
      }
    }
    return foundedIngredients;
  }

  buildIngredientsList(ingredients, selectedIngredientsIds) {
    const expandedIngredients = [];
    let counter = 0;

    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
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
        for (let j = 0; j < ingredient.get('alias').length; j++) {
          counter++;
          const synonym = ingredient.get('alias')[j];
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

    for (const selectedIngredientsId of selectedIngredientsIds) {
      this.disableSynonyms(selectedIngredientsId, expandedIngredients);
    }

    return expandedIngredients;
  }

  findIngredientByRealId(id) {
    const ingredients = this.args.ingredients.toArray();
    for (let i = 0; i < ingredients.length; i++) {
      if (ingredients.get("id") === id) {
        return ingredients[i];
      }
    }
  }

  getAllSynonyms(id, expandedIngredients) {
    return expandedIngredients.filter(function(item) {
      return item.groupId === id;
    });
  }

  disableSynonyms(id, expandedIngredients) {
    const allSynonyms = this.getAllSynonyms(id, expandedIngredients);
    for (let i = 0; i < allSynonyms.length; i++) {
      set(allSynonyms[i], 'disabled', true);
    }
  }

  get selectedIngredients() {
    return this.convertToIngredients(this.args.selectedIngredientsIds);
  }

  get filteredIngredients() {
    return this.buildIngredientsList(this.args.ingredients.toArray(), this.args.selectedIngredientsIds);
  }

  updateIngredients(changedIngredients, shouldNotify = false) {
    let selected, deselected;
    const newSelectedIds = [...this.args.selectedIngredientsIds];

    if (changedIngredients instanceof Array) {
      const ingredientsIds = this.convertToIngredientsIds(changedIngredients);
      deselected = newSelectedIds.filter(x => !ingredientsIds.includes(x));
      selected = ingredientsIds.filter(x => !newSelectedIds.includes(x));
    } else {
      const ingredientId = changedIngredients.groupId;
      deselected = this.selectedIngredients.indexOf(ingredientId) >= 0 ? [ingredientId] : [];
      selected = this.selectedIngredients.indexOf(ingredientId) === -1 ? [ingredientId] : [];
    }

    if (selected.length > 0) {
      newSelectedIds.push(selected[0]);
      if (shouldNotify && this.args.ingredientSelected) {
        this.args.ingredientSelected(selected[0]);
      }
    } else if (deselected.length > 0) {
      const index = newSelectedIds.indexOf(deselected[0]);
      newSelectedIds.splice(index, 1);
    }

    return newSelectedIds;
  }

  @action
  changeIngredients(ingredients) {
    const newSelectedIds = this.updateIngredients(ingredients, true);

    if (this.args.changeIngredients) {
      this.args.changeIngredients(newSelectedIds);
    }
  }
}

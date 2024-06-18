import Controller from '@ember/controller';

export default class IngredientsController extends Controller {
  clear() {
    const ingredientsInCategories = this.get('ingredientsInCategories');
    for (let category in this.ingredientsInCategories) {
      if (this.ingredientsInCategories.hasOwnProperty(category)) {
        ingredientsInCategories[category] = [];
      }
    }
  }

  get ingredientsInCategories() {
    const res = {};

    const ingredients = this.model.toArray();

    for (const ingredient of ingredients) {
      var category = ingredient.get('category');
      if (!res[category]) {
        res[category] = []; // Add category to res if it doesn't exist
      }
      if (category) {
        res[category].push(ingredient);
      }
    }

    for (let category in res) {
      res[category].sort((a, b) => a.get('name') < b.get('name') ? -1 : 1);
    }

    return res;
  }
}

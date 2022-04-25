import Controller from '@ember/controller';

export default class IngredientsController extends Controller {
  categories = ['Крепкие алкогольные напитки', 'Ликеры', 'Слабоалкогольные напитки', 'Безалкогольные напитки', 'Прочее'];

  clear() {
    const ingredientsInCategories = this.get('ingredientsInCategories');
    for (let category in this.ingredientsInCategories) {
      if (this.ingredientsInCategories.hasOwnProperty(category)) {
        ingredientsInCategories[category] = [];
      }
    }
  }

  get ingredientsInCategories() {
    const res = {
      'Крепкие алкогольные напитки': [],
      'Ликеры': [],
      'Слабоалкогольные напитки': [],
      'Безалкогольные напитки': [],
      'Прочее': []
    };

    const ingredients = this.model.toArray();

    for (const ingredient of ingredients) {
      if (ingredient.get('category')) {
        res[ingredient.get('category')].push(ingredient);
      }
    }

    for (let category in res) {
      res[category].sort((a, b) => a.get('name') < b.get('name') ? -1 : 1);
    }

    return res;
  }
}

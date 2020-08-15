import { observer } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  categories: ['Крепкие алкогольные напитки', 'Ликеры', 'Слабоалкогольные напитки', 'Безалкогольные напитки', 'Прочее'],
  ingredientsInCategories: {
    'Крепкие алкогольные напитки': [],
    'Ликеры': [],
    'Слабоалкогольные напитки': [],
    'Безалкогольные напитки': [],
    'Прочее': []
  },

  clear() {
    const ingredientsInCategories = this.get('ingredientsInCategories');
    for (var category in ingredientsInCategories) {
      if (ingredientsInCategories.hasOwnProperty(category)) {
        ingredientsInCategories[category] = [];
      }
    }
  },

  modelChanged: observer('model', function() {
    this.clear();
    const ingredientsInCategories = this.get('ingredientsInCategories');
    this.get('model').forEach((item) => {
      let category = item.get('category');
      if (category) {
        ingredientsInCategories[item.get('category')].push(item);
      }
    });

    for (var category in ingredientsInCategories) {
      ingredientsInCategories[category].sort((a, b) => a.get('name') < b.get('name') ? -1 : 1);
    }
  })
});

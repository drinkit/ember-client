import Ember from 'ember';

export default Ember.Controller.extend({
  categories: ['Крепкие алкогольные напитки', 'Слабоалкогольные напитки', 'Ликеры', 'Безалкогольные напитки', 'Прочее'],
  ingredientsInCategories: {
    'Крепкие алкогольные напитки': [],
    'Слабоалкогольные напитки': [],
    'Ликеры': [],
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

  modelChanged: Ember.observer('model', function() {
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

import Ember from 'ember';

export default Ember.Controller.extend({
  ingredientsInCategories: null,
  ruToEnCategory: {
    'Крепкие алкогольные напитки': 'hardSpirits',
    'Ликеры': 'liquors',
    'Слабоалкогольные напитки': 'softSpirits',
    'Безалкогольные напитки': 'nonSpirits',
    'Прочее': 'other'
  },

  actions: {
    changeIngredients: function(ingredients) {
      this.set('ingredientsInCategories', {});
      ingredients.forEach(this.moveIngredientToCategory, this);
      console.log(this.get('ingredientsInCategories'));
    }
  },

  moveIngredientToCategory: function(ingredientId) {
    var res = this.get('ingredients').filter(function(item) {
      return item.id == ingredientId;
    })[0];
    let category = this.get('ruToEnCategory')[res.get('category')];
    if (this.get('ingredientsInCategories')[category]) {
      this.get('ingredientsInCategories')[category].push(res);
    } else {
      this.get('ingredientsInCategories')[category] = [res];
    }
  }
});

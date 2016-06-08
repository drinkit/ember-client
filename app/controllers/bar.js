import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),

  selectedIngredientsIds: [],
  ingredientsInCategories: null,
  removedIngredients: null,
  ruToEnCategory: {
    'Крепкие алкогольные напитки': 'hardSpirits',
    'Ликеры': 'liquors',
    'Слабоалкогольные напитки': 'softSpirits',
    'Безалкогольные напитки': 'nonSpirits',
    'Прочее': 'other'
  },

  barItemsChanged: Ember.observer('user.barItems.[]', function() {
    let ingredients = [];
    if (this.get('user').get('barItems')) {
      ingredients = this.get('user').get('barItems').map(function(item) {
        return item.ingredientId;
      });
    } else {
      this.get('user').set('barItems', []);
    }

    Ember.run.scheduleOnce('afterRender', this, () => {
      this.set('selectedIngredientsIds', ingredients);
    });
  }),

  actions: {
    changeIngredients: function(ingredients) {
      this.set('ingredientsInCategories', {});
      this.set('removedIngredients', []);
      ingredients.forEach(this.moveIngredientToCategory, this);
    },

    ingredientSelected: function(id) {
      const self = this;
      self.get('user').get('barItems').pushObject({ingredientId: id, active: true});
      this.get('ajax').request({
        url: '/users/' + this.get('user.username') + '/barItems',
        contentType: 'application/json;charset=UTF-8',
        method: 'POST',
        data: JSON.stringify({
          ingredientId: id,
          active: true
        })
      }, function(response) {

      });
    },

    ingredientRemoved: function(removedItem) {
      let self = this;
      self.changeIngredientActivity(removedItem.groupId, false);
      this.get('ajax').request({
        url: '/users/' + this.get('user').id + '/barItems/' + removedItem.groupId,
        contentType: 'application/json;charset=UTF-8',
        method: 'PUT',
        data: JSON.stringify({
          ingredientId: removedItem.groupId,
          active: false
        })
      }, function(response) {

      });
    },

    itemRestored: function(restoredItem) {
      let self = this;
      self.changeIngredientActivity(restoredItem.groupId, true);
      this.get('ajax').request({
        url: '/users/' + this.get('user').id + '/barItems/' + restoredItem.groupId,
        contentType: 'application/json;charset=UTF-8',
        method: 'PUT',
        data: JSON.stringify({
          ingredientId: restoredItem.groupId,
          active: true
        })
      }, function(response) {

      });
    },

    itemDeleted: function(deletedItem) {
      let self = this;
      self.deleteIngredient(deletedItem.groupId);
      this.get('ajax').request({
        url: '/users/' + this.get('user').id + '/barItems/' + deletedItem.groupId,
        contentType: 'application/json;charset=UTF-8',
        method: 'DELETE'
      }, function(response) {

      });
    }
  },

  changeIngredientActivity: function(id, active) {
    const barItems = this.get('user').get('barItems');
    for (var i = 0; i < barItems.length; i++) {
      if (barItems[i].ingredientId === id) {
        barItems[i].active = active;
        this.get('user').notifyPropertyChange('barItems');
        return;
      }
    }
  },

  deleteIngredient: function(id) {
    const barItems = this.get('user').get('barItems');
    for (var i = 0; i < barItems.length; i++) {
      if (barItems[i].ingredientId === id) {
        barItems.splice(i, 1);
        this.get('user').notifyPropertyChange('barItems');
        return;
      }
    }
  },

  moveIngredientToCategory: function(ingredient) {
    if (this.isIngredientActive(ingredient.groupId)) {
      let category = this.get('ruToEnCategory')[ingredient.category];
      if (this.get('ingredientsInCategories')[category]) {
        this.get('ingredientsInCategories')[category].push(ingredient);
      } else {
        this.get('ingredientsInCategories')[category] = [ingredient];
      }
    } else {
      this.get('removedIngredients').push(ingredient);
    }
  },

  isIngredientActive: function(id) {
    let barItems = this.get('user').get('barItems');
    if (barItems) {
      for (var i = 0; i < barItems.length; i++) {
        if (barItems[i].ingredientId === id) {
          return barItems[i].active;
        }
      }
    }

    return true;
  }
});

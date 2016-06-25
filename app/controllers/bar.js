import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  modalManager: Ember.inject.service(),

  selectedIngredientsIds: [],
  ingredientsInCategories: {},
  removedIngredients: [],
  ruToEnCategory: {
    'Крепкие алкогольные напитки': 'hardSpirits',
    'Ликеры': 'liquors',
    'Слабоалкогольные напитки': 'softSpirits',
    'Безалкогольные напитки': 'nonSpirits',
    'Прочее': 'other'
  },

  barItemsChanged: Ember.observer('user.barItems.[]', function() {
    let ingredientsIds = [];
    this.set('ingredientsInCategories', {});
    this.set('removedIngredients', []);
    const self = this;
    if (this.get('user.barItems')) {
      ingredientsIds = this.get('user.barItems').map(function(item) {
        return item.ingredientId;
      });
    } else {
      this.get('user').set('barItems', []);
    }

    let ingredients = [];
    ingredients = self.get('user.barItems').map(function(item) {
      return self.store.peekRecord('ingredient', item.ingredientId);
    });
    ingredients.forEach(self.moveIngredientToCategory, self);
    self.set('selectedIngredientsIds', ingredientsIds);
  }),

  actions: {
    showLogin() {
      this.get('modalManager').showDialog('Login');
    },

    showSignUp() {
      this.get('modalManager').showDialog('SignUp');
    },

    changeIngredients: function(ingredients) {
      // do nothing
    },

    ingredientSelected: function(id) {
      const self = this;
      self.get('user.barItems').pushObject({
        ingredientId: id,
        active: true
      });
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
      self.changeIngredientActivity(removedItem.get('id'), false);
      this.get('ajax').request({
        url: '/users/' + this.get('user.username') + '/barItems/' + removedItem.get('id'),
        contentType: 'application/json;charset=UTF-8',
        method: 'PUT',
        data: JSON.stringify({
          ingredientId: removedItem.get('id'),
          active: false
        })
      }, function(response) {

      });
    },

    itemRestored: function(restoredItem) {
      let self = this;
      self.changeIngredientActivity(restoredItem.get('id'), true);
      this.get('ajax').request({
        url: '/users/' + this.get('user.username') + '/barItems/' + restoredItem.get('id'),
        contentType: 'application/json;charset=UTF-8',
        method: 'PUT',
        data: JSON.stringify({
          ingredientId: restoredItem.get('id'),
          active: true
        })
      }, function(response) {

      });
    },

    itemDeleted: function(deletedItem) {
      let self = this;
      self.deleteIngredient(deletedItem.get('id'));
      this.get('ajax').request({
        url: '/users/' + this.get('user.username') + '/barItems/' + deletedItem.get('id'),
        contentType: 'application/json;charset=UTF-8',
        method: 'DELETE'
      }, function(response) {

      });
    }
  },

  changeIngredientActivity: function(id, active) {
    const barItems = this.get('user.barItems');
    for (var i = 0; i < barItems.length; i++) {
      if (barItems[i].ingredientId == id) {
        barItems[i].active = active;
        this.get('user').notifyPropertyChange('barItems');
        return;
      }
    }
  },

  deleteIngredient: function(id) {
    const barItems = this.get('user.barItems');
    for (var i = 0; i < barItems.length; i++) {
      if (barItems[i].ingredientId == id) {
        barItems.splice(i, 1);
        this.get('user').notifyPropertyChange('barItems');
        return;
      }
    }
  },

  moveIngredientToCategory: function(ingredient) {
    if (ingredient == null) {
      return;
    };
    if (this.isIngredientActive(ingredient.get('id'))) {
      let category = this.get('ruToEnCategory')[ingredient.get('category')];
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
    let barItems = this.get('user.barItems');
    if (barItems) {
      for (var i = 0; i < barItems.length; i++) {
        if (barItems[i].ingredientId == id) {
          return barItems[i].active;
        }
      }
    }

    return true;
  }
});

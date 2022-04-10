import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import qs from 'qs';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default Controller.extend({
  ajax: service(),
  modalManager: service(),
  simpleStore: service(),
  repository: service(),

  @tracked selectedIngredientsIds: A(),
  ingredientsInCategories: {},
  removedIngredients: A(),
  suggestedIngredients: A(),
  ruToEnCategory: {
    'Крепкие алкогольные напитки': 'hardSpirits',
    'Ликеры': 'liquors',
    'Слабоалкогольные напитки': 'softSpirits',
    'Безалкогольные напитки': 'nonSpirits',
    'Прочее': 'other'
  },

  barItemsChanged: observer('user.barItems.[]', function() {
    const store = this.get('simpleStore');
    let ingredientsIds = [];
    this.set('ingredientsInCategories', {});
    this.removedIngredients.clear();
    const self = this;
    if (this.get('user.barItems')) {
      ingredientsIds = this.get('user.barItems').map(function(item) {
        return item.ingredientId;
      });
    } else {
      this.get('user').set('barItems', []);
    }

    let ingredients = self.get('user.barItems').map(function(item) {
      return store.find('ingredient', item.ingredientId);
    });
    ingredients.forEach(self.moveIngredientToCategory, self);
    if (ingredientsIds.length !== self.get('selectedIngredientsIds.length')) {
      self.selectedIngredientsIds.setObjects(ingredientsIds.toArray());
    }
  }),

  ingredientsIdsChanged: observer('user.barItems.[]', function() {
    const user = this.get('user');
    this.set('suggestedIngredientsInitialized', true);
    if (this.get('user.barItems') && this.get('user.barItems.length') > 0) {
      const repository = this.get('repository');
      const store = this.get('simpleStore');
      const self = this;
      let ingredientsIds = this.get('user.barItems').map(function(item) {
        return item.ingredientId;
      });
      store.clear('suggestedIngredient');
      self.set('suggestedIngredientsInitialized', false);
      const suggestSuffix = user.get('role') === 'ADMIN' ? '?viewAll=true&' : '?viewAll=false&';
      repository.find('suggestedIngredient', {
        url: '/ingredients/suggest' + suggestSuffix + qs.stringify({
          id: ingredientsIds
        }, { arrayFormat: 'brackets' }),
        method: 'GET'
      }).then(function(response) {
        self.set('suggestedIngredientsInitialized', true);
        self.suggestedIngredients.setObjects(response.toArray());
      }, function() {
        self.set('suggestedIngredientsInitialized', true);
        self.suggestedIngredients.clear()
      })
    }

  }),

  @action
  ingredientSelected(id) {
    const self = this;
    self.get('user.barItems').pushObject({
      ingredientId: id,
      active: true
    });
    this.get('ajax').request({
      url: '/users/' + this.get('user.username') + '/barItems',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      method: 'POST',
      body: JSON.stringify({
        ingredientId: id,
        active: true
      })
    }, function(response) {

    });
  },

  @action
  showLogin() {
    this.get('modalManager').showDialog('Login');
  },

  @action
  itemDeleted(deletedItem) {
    let self = this;
    self.deleteIngredient(deletedItem.get('id'));
    this.get('ajax').request({
      url: '/users/' + this.get('user.username') + '/barItems/' + deletedItem.get('id'),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      method: 'DELETE'
    }, function() {
    });
  },

  changeIngredientActivity(id, active) {
    const barItems = this.get('user.barItems');
    for (var i = 0; i < barItems.length; i++) {
      if (barItems[i].ingredientId == id) {
        barItems[i].active = active;
        this.get('user').notifyPropertyChange('barItems');
        return;
      }
    }
  },

  deleteIngredient(id) {
    const barItems = this.get('user.barItems');
    let item = barItems.findBy('ingredientId', id);

    if (item) {
      barItems.removeObject(item);
    }
  },

  moveIngredientToCategory(ingredient) {
    if (ingredient == null) {
      return;
    }
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

  isIngredientActive(id) {
    const barItems = this.get('user.barItems');
    let item = barItems.findBy('ingredientId', id);

    if (item) {
      return item.active;
    }

    return true;
  }
});

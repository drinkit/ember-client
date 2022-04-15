import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import qs from 'qs';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const RuToEnCategory = {
  'Крепкие алкогольные напитки': 'hardSpirits',
  'Ликеры': 'liquors',
  'Слабоалкогольные напитки': 'softSpirits',
  'Безалкогольные напитки': 'nonSpirits',
  'Прочее': 'other'
}

export default class BarController extends Controller {
  @service ajax;
  @service modalManager;
  @service simpleStore;

  @tracked suggestedIngredientsInitialized = false;
  @tracked suggestedIngredients = A();

  constructor(owner, args) {
    super(owner, args);
    this.addObserver("user.barItems.[]", () => {
      this.updateSuggestedIngredients();
    });
  }

  get selectedIngredientsIds() {
    let ingredientsIds;
    if (this.get('user.barItems')) {
      ingredientsIds = this.get('user.barItems').map(function(item) {
        return item.ingredientId;
      });
    }

    return ingredientsIds;
  }

  get ingredientsInCategories() {
    let ingredients = this.get('user.barItems').map((item) => this.simpleStore.find('ingredient', item.ingredientId));
    let categorisedIngredients = {};

    for (const categorisedIngredient of ingredients) {
      if (!categorisedIngredient) continue;
      let category = RuToEnCategory[categorisedIngredient.get('category')];
      if (categorisedIngredients[category]) {
        categorisedIngredients[category].push(categorisedIngredient);
      } else {
        categorisedIngredients[category] = [categorisedIngredient];
      }
    }

    return categorisedIngredients;
  }

  @action
  ingredientSelected(id) {
    this.addIngredient(id);
    this.ajax.request({
      url: '/users/' + this.get('user.username') + '/barItems',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      method: 'POST',
      body: JSON.stringify({
        ingredientId: id,
        active: true
      })
    }, function(response) {});
  }

  @action
  showLogin() {
    this.modalManager.showDialog('Login');
  }

  @action
  itemDeleted(deletedItem) {
    this.deleteIngredient(deletedItem.get('id'));
    this.ajax.request({
      url: '/users/' + this.get('user.username') + '/barItems/' + deletedItem.get('id'),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      method: 'DELETE'
    }, function() {});
  }

  addIngredient(id) {
    this.get('user.barItems').pushObject({
      ingredientId: id,
      active: true
    });
  }

  deleteIngredient(id) {
    const barItems = this.get('user.barItems');
    let item = barItems.findBy('ingredientId', id);

    if (item) {
      barItems.removeObject(item);
    }
  }

  updateSuggestedIngredients() {
    if (this.get('user.barItems') && this.get('user.barItems.length') > 0) {
      const self = this;
      this.suggestedIngredientsInitialized = false;
      const suggestSuffix = this.user.get('role') === 'ADMIN' ? '?viewAll=true&' : '?viewAll=false&';
      this.ajax.request({
        url: '/ingredients/suggest' + suggestSuffix + qs.stringify({
          id: this.selectedIngredientsIds
        }, { arrayFormat: 'brackets' }),
        method: 'GET'
      }, function(response) {
        self.suggestedIngredientsInitialized = true;
        self.suggestedIngredients.setObjects(response.toArray());
      }, function() {
        self.suggestedIngredientsInitialized = true;
        self.suggestedIngredients.clear()
      });
    }
  }
}

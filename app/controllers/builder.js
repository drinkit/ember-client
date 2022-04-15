import {inject as service} from '@ember/service';
import {A} from '@ember/array';
import {tracked} from '@glimmer/tracking';
import { action } from '@ember/object';
import PaginationController from "./pagination";

export default class BuilderController extends PaginationController {
  @service session;
  @service simpleStore;
  @service currentUser;
  @service ajax;
  @service headData;

  cocktailTypes = A([]);
  cocktailOptions = A([]);

  @tracked selectedIngredientsIds = A([]);
  @tracked isSearchPerformed = false;
  @tracked isSearchStarting = false;

  get recipes() {
    let self = this;
    const allFoundedRecipes = this.simpleStore.find('foundedRecipe');
    return allFoundedRecipes.filter(item => {
      return item.get('published') || (self.get('currentUser.isAuthenticated') && self.get('currentUser.role') === 'ADMIN')
    });
  }

  performSearch() {
    const that = this;
    this.isSearchStarting = true;
    this.ajax.request({
      url: "/recipes",
      method: "GET",
      body: {
        criteria: JSON.stringify({
          ingredients: this.selectedIngredientsIds || [],
          cocktailTypes: this.cocktailTypes || [],
          options: this.cocktailOptions || []
        })
      }
    }, function(result) {
      that.simpleStore.clear('foundedRecipe');
      result.forEach(function(item) {
        if (item.published) {
          that.simpleStore.push('foundedRecipe', item);
        } else if (that.get('currentUser.isAuthenticated') && that.get('currentUser.role') === 'ADMIN') {
          that.simpleStore.push('foundedRecipe', item);
        }
      });
      that.isSearchStarting = false;
      that.isSearchPerformed = true;
    });
  }

  @action
  toggleOption(id) {
    const index = this.cocktailOptions.indexOf(id);

    if (index >= 0) {
      this.cocktailOptions.removeObject(id);
    } else {
      this.cocktailOptions.pushObject(id);
    }

    this.pageNumber = 0;
    this.performSearch();
  }

  @action
  toggleType(id) {
    const index = this.cocktailTypes.indexOf(id);

    if (index >= 0) {
      this.cocktailTypes.removeObject(id);
    } else {
      this.cocktailTypes.pushObject(id);
    }

    this.pageNumber = 0;
    this.performSearch();
  }

  @action
  changeIngredients(ingredients) {
    this.selectedIngredientsIds.setObjects(ingredients);
    this.pageNumber = 0;
    this.performSearch();
  }

  @action
  clearFilters() {
    this.cocktailTypes.clear();
    this.cocktailOptions.clear();
    this.selectedIngredientsIds.clear();
    this.pageNumber = 0;
    this.performSearch();
  }
}

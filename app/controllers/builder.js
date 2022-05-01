import {inject as service} from '@ember/service';
import {A} from '@ember/array';
import {tracked, cached} from '@glimmer/tracking';
import { action } from '@ember/object';
import PaginationController from "./pagination";

export default class BuilderController extends PaginationController {
  @service simpleStore;
  @service currentUser;
  @service ajax;

  @tracked cocktailTypes = A([]);
  @tracked cocktailOptions = A([]);
  @tracked onlyLiked = false;

  @tracked selectedIngredientsIds = A([]);
  @tracked isSearchPerformed = false;
  @tracked isSearchStarting = false;

  @cached
  get recipes() {
    let self = this;
    const allFoundedRecipes = this.simpleStore.find('foundedRecipe');
    const filters = [this.filterByPublish];
    if (this.cocktailTypes.length > 0) {
      filters.push(this.filterByType);
    }
    if (this.cocktailOptions.length > 0) {
      filters.push(this.filterByOptions);
    }
    if (this.onlyLiked) {
      filters.push(this.filterByLiked);
    }
    return allFoundedRecipes.filter(item => {
      return filters.reduce((res, fn) => res && fn(item, self), true);
    });
  }

  filterByPublish(item, target) {
    return item.get('published') || (target.currentUser.isAuthenticated && target.currentUser.role === 'ADMIN');
  }

  filterByType(item, target) {
    return target.cocktailTypes.includes(item.get("cocktailTypeId"));
  }

  filterByOptions(item, target) {
    return target.cocktailOptions.every(i => item.get("options").includes(i));
  }

  filterByLiked(item, target) {
    return target.currentUser.isAuthenticated &&
      target.currentUser.recipeStatsMap.hasOwnProperty(item.get("id")) &&
      target.currentUser.recipeStatsMap[item.get("id")].liked;
  }

  performSearch() {
    const that = this;
    this.isSearchStarting = true;
    this.ajax.request({
      url: "/recipes",
      method: "GET",
      body: {
        criteria: JSON.stringify({
          ingredients: this.selectedIngredientsIds || []
        })
      }
    }, function(result) {
      that.simpleStore.clear('foundedRecipe');
      that.simpleStore.pushArray('foundedRecipe', result);
      that.isSearchStarting = false;
      that.isSearchPerformed = true;
    });
  }

  @action
  toggleOnlyLiked() {
    this.onlyLiked = !this.onlyLiked;
    this.pageNumber = 0;
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
    this.onlyLiked = false;
    if (this.selectedIngredientsIds.length > 0) {
      this.selectedIngredientsIds.clear();
      this.performSearch();
    }

    this.pageNumber = 0;
  }
}

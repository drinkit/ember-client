import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import PaginationMixin from '../mixins/pagination';

export default Controller.extend(PaginationMixin, {
  session: service(),
  simpleStore: service(),
  currentUser: service(),
  ajax: service(),
  headData: service(),
  cocktailTypes: [],
  cocktailOptions: [],
  selectedIngredientsIds: [],
  isSearchPerformed: false,
  isSearchStarting: false,

  recipes: computed('allRecipes.[]', function() {
    let allRecipes = this.get('allRecipes');
    let self = this;
    let filteredRecipes = allRecipes.filter(item => {
      return item.get('published') || (self.get('currentUser.isAuthenticated') && self.get('currentUser.role') == 'ADMIN')
    });
    return filteredRecipes;
  }),

  performSearch: function() {
    var that = this;
    this.set('isSearchStarting', true);
    this.get('ajax').request({
      url: "/recipes",
      method: "GET",
      body: {
        criteria: JSON.stringify({
          ingredients: this.get('selectedIngredientsIds') || [],
          cocktailTypes: this.get('cocktailTypes') || [],
          options: this.get('cocktailOptions') || []
        })
      }
    }, function(result) {
      that.get('simpleStore').clear('foundedRecipe');
      result.forEach(function(item) {
        if (item.published) {
          that.get('simpleStore').push('foundedRecipe', item);
        } else if (that.get('currentUser.isAuthenticated') && that.get('currentUser.role') == 'ADMIN') {
          that.get('simpleStore').push('foundedRecipe', item);
        }
      });
      that.set('allRecipes', that.get('simpleStore').find('foundedRecipe'));
      that.set('isSearchStarting', false);
      that.set('isSearchPerformed', true);
    });
  },

  actions: {
    toggleOption(id) {
      var options = this.get('cocktailOptions');
      var index = options.indexOf(id);

      if (index >= 0) {
        options.removeObject(id);
      } else {
        options.pushObject(id);
      }

      this.set('cocktailOptions', options);
      this.set('pageNumber', 0);
      this.performSearch();
    },

    toggleType(id) {
      var types = this.get('cocktailTypes');
      var index = types.indexOf(id);

      if (index >= 0) {
        types.removeObject(id);
      } else {
        types.pushObject(id);
      }

      this.set('cocktailTypes', types);
      this.set('pageNumber', 0);
      this.performSearch();
    },

    changeIngredients(ingredients) {
      this.set('selectedIngredientsIds', ingredients);
      this.set('pageNumber', 0);
      this.performSearch();
    },

    clearFilters() {
      this.set('cocktailTypes', []);
      this.set('cocktailOptions', []);
      this.set('selectedIngredientsIds', []);
      this.set('pageNumber', 0);
      this.performSearch();
    }
  }
});

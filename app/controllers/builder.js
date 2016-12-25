import Ember from 'ember';
import PaginationMixin from '../mixins/pagination';

export default Ember.Controller.extend(PaginationMixin, {
  session: Ember.inject.service(),
  simpleStore: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  ajax: Ember.inject.service(),
  headData: Ember.inject.service(),
  cocktailTypes: [],
  cocktailOptions: [],
  selectedIngredientsIds: [],
  isSearchPerformed: false,

  performSearch: function() {
    var that = this;
    this.get('ajax').request({
      url: "/recipes",
      method: "GET",
      data: {
        criteria: JSON.stringify({
          ingredients: this.get('selectedIngredientsIds') || [],
          cocktailTypes: this.get('cocktailTypes') || [],
          options: this.get('cocktailOptions') || []
        })
      }
    }, function(result) {
      that.get('simpleStore').clear('recipe');
      result.forEach(function(item) {
        if (item.published) {
          that.get('simpleStore').push('recipe', item);
        } else if (that.get('currentUser.isAuthenticated') && that.get('currentUser.role') == 'ADMIN') {
          that.get('simpleStore').push('recipe', item);
        }
      });
      that.set('isSearchPerformed', true);
    });
  },

  actions: {
    toggleOption(id) {
      var options = this.get('cocktailOptions');
      var index = options.indexOf(id);

      if (index >= 0) {
        options.splice(index, 1);
      } else {
        options.push(id);
      }

      this.set('cocktailOptions', options);
      this.set('pageNumber', 0);
      this.performSearch();
    },

    toggleType(id) {
      var types = this.get('cocktailTypes');
      var index = types.indexOf(id);

      if (index >= 0) {
        types.splice(index, 1);
      } else {
        types.push(id);
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

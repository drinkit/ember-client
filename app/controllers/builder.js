import Ember from 'ember';
import PaginationMixin from '../mixins/pagination';

export default Ember.Controller.extend(PaginationMixin, {
  session: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  ajax: Ember.inject.service(),
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
          ingredients: this.get("selectedIngredientsIds") || [],
          cocktailTypes: this.get("cocktailTypes") || [],
          options: this.get("cocktailOptions") || []
        })
      }
    }, function(result) {
      that.set('isSearchPerformed', true);
      that.store.unloadAll("recipe");
      result.forEach(function(item) {
        item.views = (Math.random() * 200).toFixed(0);
        item.likes = (Math.random() * 200).toFixed(0);
        if (item.published) {
          that.store.push(that.store.normalize("recipe", item));
        } else if (that.get('currentUser').get('isAuthenticated') && that.get('currentUser').get('accessLevel') === 0) {
          that.store.push(that.store.normalize("recipe", item));
        }
      });
    });
  },
  actions: {
    toggleOption(id) {
      var options = this.get("cocktailOptions");
      var index = options.indexOf(id);

      if (index >= 0) {
        options.splice(index, 1);
      } else {
        options.push(id);
      }

      this.set("cocktailOptions", options);
      this.set('pageNumber', 0);
      this.performSearch();
    },

    toggleType(id) {
      var types = this.get("cocktailTypes");
      var index = types.indexOf(id);

      if (index >= 0) {
        types.splice(index, 1);
      } else {
        types.push(id);
      }

      this.set("cocktailTypes", types);
      this.set('pageNumber', 0);
      this.performSearch();
    },

    changeIngredients(ingredients) {
      let selectedIngredientsIds = ingredients.map(function(item) {
        return item.groupId;
      });
      this.set('selectedIngredientsIds', selectedIngredientsIds);
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

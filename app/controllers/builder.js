import Ember from 'ember';
import PaginationMixin from '../mixins/pagination';

export default Ember.Controller.extend(PaginationMixin, {
  session: Ember.inject.service('session'),
  ajax: Ember.inject.service('ajax'),
  queryParams: ["pageNumber"],
  cocktailTypes: [],
  cocktailOptions: [],
  selectedIngredients: [],

  performSearch: function() {
    var that = this;
    this.get('ajax').request({
      url: "/recipes",
      method: "GET",
      data: {
        criteria: JSON.stringify({
          ingredients: this.get("selectedIngredients") || [],
          cocktailTypes: this.get("cocktailTypes") || [],
          options: this.get("cocktailOptions") || []
        })
      }
    }, function(result) {
      that.store.unloadAll("recipe");

      result.forEach(function(item) {
        that.store.push(that.store.normalize("recipe", item));
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
        this.performSearch();
      },

      doSearch() {
        this.performSearch();
      }
  }
});

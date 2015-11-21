import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  queryParams: {
    search: {
      refreshModel: true
    }
  },

  actions: {
    openRecipe: function(id) {
      this.transitionTo('recipe', id);
    }
  },

  setupController: function(controller, modelHash) {
      controller.setProperties(modelHash);
  },

  beforeModel: function() {
    var params = this.paramsFor('recipes');
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      that.get('ajax').request({
          url: "/recipes",
          method: "GET",
          data: {
            namePart: params.search
          }
        },
        function(response) {
          that.store.unloadAll("recipe");

          response.forEach(function(item) {
            that.store.push(that.store.normalize("recipe", item));
          });

          resolve();
        });
    });

  },

  model: function() {
    return new Ember.RSVP.hash({
      ingredients: this.store.findAll('ingredient'),
      recipes: this.store.peekAll('recipe')
    });
  }
});

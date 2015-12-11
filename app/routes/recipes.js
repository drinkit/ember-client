import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  currentUser: Ember.inject.service(),

  queryParams: {
    search: {
      refreshModel: true
    }
  },

  setupController: function(controller, modelHash) {
    controller.setProperties(modelHash);
  },

  beforeModel: function() {
    var params = this.paramsFor('recipes');
    var that = this;
    that.store.unloadAll("recipe");
    return new Ember.RSVP.Promise(function(resolve, reject) {
      that.get('ajax').request({
          url: "/recipes",
          method: "GET",
          data: {
            namePart: params.search
          }
        },
        function(response) {
          response.forEach(function(item) {
            if (item.published) {
              that.store.push(that.store.normalize("recipe", item));
            } else if (that.get('currentUser').get('isAuthenticated')
            && that.get('currentUser').get('accessLevel') == 0) {
              that.store.push(that.store.normalize("recipe", item));
            }
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

import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  metrics: Ember.inject.service(),

  queryParams: {
    search: {
      refreshModel: true
    }
  },

  setupController: function(controller, modelHash) {
    controller.setProperties(modelHash);
    controller.set('pageNumber', 0);
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
            if (item.published) {
              that.store.push(that.store.normalize("recipe", item));
            } else if (that.get('currentUser').get('isAuthenticated')
            && that.get('currentUser').get('accessLevel') == 0) {
              that.store.push(that.store.normalize("recipe", item));
            }
          });

          // if (that.get('controller')) {
          //   that.get('controller').set('pageNumber', 0);
          // }
          resolve();
        });
    });

  },

  actions: {
    didTransition: function() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        const page = document.location.pathname + document.location.search;
        const title = "Поиск";

        Ember.get(this, 'metrics').trackPage({ page, title });
      });
    }
  },

  model: function() {
    return new Ember.RSVP.hash({
      ingredients: this.store.findAll('ingredient'),
      recipes: this.store.peekAll('recipe')
    });
  }
});

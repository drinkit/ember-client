import Ember from 'ember';
import RememberScrollMixin from '../mixins/remember-scroll';

export default Ember.Route.extend(RememberScrollMixin, {
  ajax: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  metrics: Ember.inject.service(),

  headData: Ember.inject.service(),

  afterModel(model) {
    this.set('headData.title', 'drinkIt - Результаты поиска');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
  },

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
            } else if (that.get('currentUser').get('isAuthenticated') && that.get('currentUser').get('role') === 'ADMIN') {
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

        Ember.get(this, 'metrics').trackPage({
          page,
          title
        });
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

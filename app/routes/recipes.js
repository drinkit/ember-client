import Ember from 'ember';
import RememberScrollMixin from '../mixins/remember-scroll';

export default Ember.Route.extend(RememberScrollMixin, {
  ajax: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  metrics: Ember.inject.service(),
  simpleStore: Ember.inject.service(),
  repository: Ember.inject.service(),

  headData: Ember.inject.service(),

  afterModel(model, transition) {
    this.set('headData.title', 'Результаты поиска - drinkIt');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
    if (transition.queryParams && transition.queryParams.pageNumber) {
      this.set('headData.robots', 'noindex, follow');
    }
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
    const params = this.paramsFor('recipes');
    const self = this;
    const store = this.get('simpleStore');

    return new Ember.RSVP.Promise(function(resolve, reject) {

      self.get('ajax').request({
          url: "/recipes",
          method: "GET",
          data: {
            namePart: params.search
          }
        },
        function(response) {
          store.clear('recipe');
          response.forEach(function(item) {
            if (item.published) {
              store.push('recipe', item);
            } else if (self.get('currentUser.isAuthenticated') && self.get('currentUser.role') === 'ADMIN') {
              store.push('recipe', item);
            }
          });

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
    const repository = this.get('repository');
    const store = this.get('simpleStore');
    return new Ember.RSVP.hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      recipes: store.find('recipe')
    });
  }
});

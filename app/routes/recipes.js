import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { Promise, hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RememberScrollMixin from '../mixins/remember-scroll';

export default Route.extend(RememberScrollMixin, {
  ajax: service(),
  currentUser: service(),
  metrics: service(),
  simpleStore: service(),
  repository: service(),
  headData: service(),

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

    return new Promise(function(resolve, reject) {
      self.get('ajax').request({
          url: "/recipes",
          method: "GET",
          body: {
            namePart: params.search
          }
        },
        function(response) {
          store.clear('foundedRecipe');
          response.forEach(function(item) {
            if (item.published) {
              store.push('foundedRecipe', item);
            } else if (self.get('currentUser.isAuthenticated') && self.get('currentUser.role') === 'ADMIN') {
              store.push('foundedRecipe', item);
            }
          });

          resolve();
        });
    });
  },

  actions: {
    didTransition: function() {
      scheduleOnce('afterRender', this, () => {
        const page = document.location.pathname + document.location.search;
        const title = "Поиск";

        get(this, 'metrics').trackPage({
          page,
          title
        });
      });
    }
  },

  model: function() {
    const repository = this.get('repository');
    const store = this.get('simpleStore');
    return new hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      recipes: store.find('foundedRecipe')
    });
  }
});

import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { Promise, hash } from 'rsvp';
import { inject as service } from '@ember/service';
import RememberScrollRoute from "./remember-scroll";

export default class RecipesRoute extends RememberScrollRoute {
  @service ajax;
  @service currentUser;
  @service metrics;
  @service simpleStore;
  @service repository;
  @service headData;

  queryParams = {
    search: {
      refreshModel: true
    }
  }

  setupController(controller, modelHash) {
    controller.setProperties(modelHash);
    controller.set('pageNumber', 0);
  }

  beforeModel() {
    const params = this.paramsFor('recipes');
    const self = this;

    return new Promise(function(resolve, reject) {
      self.simpleStore.clear('foundedRecipe');
      self.ajax.request({
          url: "/recipes",
          method: "GET",
          body: {
            namePart: params.search
          }
        },
        function(response) {
          response.forEach(function(item) {
            if (item.published) {
              self.simpleStore.push('foundedRecipe', item);
            } else if (self.get('currentUser.isAuthenticated') && self.get('currentUser.role') === 'ADMIN') {
              self.simpleStore.push('foundedRecipe', item);
            }
          });

          resolve();
        });
    });
  }

  model() {
    return new hash({
      ingredients: this.repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      allRecipes: this.simpleStore.find('foundedRecipe')
    });
  }

  afterModel(model, transition) {
    this.set('headData.title', 'Результаты поиска - drinkIt');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
    if (transition.queryParams && transition.queryParams.pageNumber) {
      this.set('headData.robots', 'noindex, follow');
    }
  }

  @action
  didTransition() {
    scheduleOnce('afterRender', this, () => {
      const page = document.location.pathname + document.location.search;
      const title = "Поиск";

      this.metrics.trackPage({
        page,
        title
      });
    });
  }
}

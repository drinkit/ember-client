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

  model(params) {
    this.simpleStore.clear('foundedRecipe');
    return new hash({
      ingredients: this.repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      allRecipes: this.repository.find('foundedRecipe', {
        url: "/recipes",
        method: "GET",
        body: {
          namePart: params.search
        }
      })
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

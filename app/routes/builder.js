import { scheduleOnce } from '@ember/runloop';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import RememberScrollRoute from "./remember-scroll";

export default class BuilderRoute extends RememberScrollRoute {
  @service metrics;
  @service headData;
  @service repository;
  @service simpleStore;

  model() {
    let repository = this.get('repository');
    return new hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      allRecipes: repository.find('foundedRecipe', {
        url: '/recipes',
        method: 'GET',
        body: {
          criteria: JSON.stringify({
            ingredients: [],
            cocktailTypes: [],
            options: []
          })
        }
      }, 2)
    });
  }

  afterModel(model, transition) {
    this.set('headData.title', 'Конструктор коктейлей - drinkIt');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
    if (transition.queryParams && transition.queryParams.pageNumber) {
      this.set('headData.robots', 'noindex, follow');
    }
  }

  setupController(controller, modelHash) {
    controller.setProperties(modelHash);
    if (controller.get('cocktailTypes.length') > 0 ||
        controller.get('cocktailOptions.length') > 0 ||
        controller.get('selectedIngredientsIds.length') > 0) {
      controller.performSearch();
    }
  }

  @action
  didTransition() {
    scheduleOnce('afterRender', this, () => {
      const page = "/builder";
      const title = "drinkIt";
      this.metrics.trackPage({
        page,
        title
      });
    });
  }
}

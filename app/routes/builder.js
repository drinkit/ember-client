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
      allRecipes: repository.find('recipe', {
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
    if (this.simpleStore.find('foundedRecipe').length === 0) {
      this.simpleStore.pushArray('foundedRecipe', model.allRecipes);
    }

    this.set('headData.title', 'Конструктор коктейлей - drinkIt');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
    if (transition.to.queryParams && transition.to.queryParams.pageNumber) {
      this.set('headData.robots', 'noindex, follow');
    }
    transition.then(() => {
      this.set('headData.canonical', window.location.href);
    });
  }

  setupController(controller, modelHash) {
    controller.setProperties(modelHash);
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

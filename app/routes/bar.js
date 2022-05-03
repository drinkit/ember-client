import { scheduleOnce } from '@ember/runloop';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class BarRoute extends Route {
  @service metrics;
  @service currentUser;
  @service repository;
  @service headData;

  model() {
    const repository = this.get('repository');
    return new hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      user: this.currentUser,
      recipes: repository.find('recipe', {
        url: '/recipes',
        method: 'GET',
        body: {
          criteria: JSON.stringify({
            ingredients: [],
            cocktailTypes: [],
            options: []
          })
        }
      })
    });
  }

  afterModel(model, transition) {
    this.set('headData.title', 'Мой бар - drinkIt');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
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
      const page = "/bar";
      const title = "drinkIt";
      this.metrics.trackPage({page, title});
    });
  }
}

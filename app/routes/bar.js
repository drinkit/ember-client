import { scheduleOnce } from '@ember/runloop';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import localize from "../utils/localize";

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
    this.set('headData.title', `${localize('Мой бар', 'My bar', 'Мій бар')} - drinkIt`);
    this.set('headData.description', localize(
  'Конструктор для составления коктейлей. Более 300 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.', // Russian
  'Cocktail constructor. More than 300 recipes, convenient filters, smart search. Saving the bar list and selecting cocktails based on the contents of the bar.', // English
  'Конструктор для складання коктейлів. Більше 300 рецептів, зручні фільтри, розумний пошук. Збереження барного листа і підбір коктейлів за вмістом бару.' // Ukrainian
));
    transition.then(() => {
      this.set('headData.canonical', document.location.origin + document.location.pathname);
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
